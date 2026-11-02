<?php

namespace App\Http\Controllers\Api\V1\Provider;

use App\Contracts\Storage\MediaStorage;
use App\Http\Controllers\Api\V1\ApiController;
use App\Models\Account;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class LegacyPropertyMediaController extends ApiController
{
    /**
     * Creates a short-lived, provider-scoped S3 upload URL before a legacy
     * property exists. The app uploads the bytes directly to S3 and submits
     * the returned object keys with the property form.
     */
    public function uploadUrl(Request $request, MediaStorage $storage): JsonResponse
    {
        /** @var Account $provider */
        $provider = $request->user();
        abort_if($provider->legacy_user_id === null, 422, 'Your provider account is not linked to a legacy user.');

        $validated = $request->validate([
            'filename' => ['required', 'string', 'max:160'],
            'content_type' => ['required', 'in:image/jpeg,image/png,image/webp'],
            'size_bytes' => ['required', 'integer', 'min:1', 'max:10485760'],
        ]);

        $extension = strtolower(pathinfo($validated['filename'], PATHINFO_EXTENSION));
        $allowedExtensions = [
            'image/jpeg' => ['jpg', 'jpeg'],
            'image/png' => ['png'],
            'image/webp' => ['webp'],
        ];
        if (! in_array($extension, $allowedExtensions[$validated['content_type']], true)) {
            return $this->failure('The filename extension does not match the image type.', 'INVALID_MEDIA_TYPE', 422);
        }

        try {
            $prefix = config('investormart.mobile_property_upload_prefix');
            $objectKey = $prefix.'/'.$provider->legacy_user_id.'/'.Str::uuid().'.'.$extension;
            $upload = $storage->createUploadUrl($objectKey, $validated['content_type']);
        } catch (\Throwable $exception) {
            report($exception);

            return $this->failure('Media storage is not available right now.', 'MEDIA_STORAGE_UNAVAILABLE', 503);
        }

        return $this->success(['upload' => $upload]);
    }
}
