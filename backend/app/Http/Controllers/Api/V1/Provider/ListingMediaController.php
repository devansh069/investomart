<?php

namespace App\Http\Controllers\Api\V1\Provider;

use App\Contracts\Storage\MediaStorage;
use App\Http\Controllers\Api\V1\ApiController;
use App\Models\Listing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ListingMediaController extends ApiController
{
    public function uploadUrl(Request $request, string $id, MediaStorage $storage): JsonResponse
    {
        $listing = Listing::query()->whereKey($id)->where('provider_account_id', $request->user()->id)->first();
        abort_if($listing === null, 404, 'Property not found.');

        $validated = $request->validate([
            'filename' => ['required', 'string', 'max:160'],
            'content_type' => ['required', 'string', 'regex:/^(image\/(jpeg|png|webp)|video\/mp4)$/'],
        ]);
        $extension = strtolower(pathinfo($validated['filename'], PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'webp', 'mp4'];
        if (! in_array($extension, $allowed, true)) {
            return $this->failure('Unsupported media file type.', 'UNSUPPORTED_MEDIA_TYPE', 422);
        }

        try {
            $result = $storage->createUploadUrl(
                'listings/'.$request->user()->id.'/'.$listing->id.'/'.Str::uuid().'.'.$extension,
                $validated['content_type'],
            );
        } catch (\Throwable $exception) {
            report($exception);

            return $this->failure('Media storage is not available right now.', 'MEDIA_STORAGE_UNAVAILABLE', 503);
        }

        return $this->success(['upload' => $result]);
    }

    public function attach(Request $request, string $id): JsonResponse
    {
        $listing = Listing::query()->whereKey($id)->where('provider_account_id', $request->user()->id)->first();
        abort_if($listing === null, 404, 'Property not found.');

        $validated = $request->validate([
            'object_key' => ['required', 'string', 'max:1024'],
            'media_type' => ['required', 'in:image,video'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:100'],
            'metadata' => ['nullable', 'array'],
        ]);
        $prefix = 'listings/'.$request->user()->id.'/'.$listing->id.'/';
        if (! str_starts_with($validated['object_key'], $prefix)) {
            return $this->failure('The uploaded media does not belong to this property.', 'INVALID_MEDIA_KEY', 422);
        }

        $media = $listing->media()->create([
            'disk' => 's3', 'object_key' => $validated['object_key'], 'media_type' => $validated['media_type'],
            'sort_order' => $validated['sort_order'] ?? $listing->media()->count(), 'metadata' => $validated['metadata'] ?? [],
        ]);

        return $this->success(['media' => [
            'id' => $media->id, 'object_key' => $media->object_key, 'media_type' => $media->media_type,
            'sort_order' => $media->sort_order,
        ]], 'Media attached to the property.');
    }
}
