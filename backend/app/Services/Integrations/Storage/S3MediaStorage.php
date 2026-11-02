<?php

namespace App\Services\Integrations\Storage;

use App\Contracts\Storage\MediaStorage;
use Illuminate\Support\Facades\Storage;

class S3MediaStorage implements MediaStorage
{
    public function createUploadUrl(string $objectKey, string $contentType, int $expiresInSeconds = 900): array
    {
        $upload = Storage::disk('s3')->temporaryUploadUrl(
            $objectKey,
            now()->addSeconds($expiresInSeconds),
            ['ContentType' => $contentType],
        );

        return [
            'upload_url' => $upload['url'],
            'object_key' => $objectKey,
            'expires_at' => now()->addSeconds($expiresInSeconds)->toIso8601String(),
            'headers' => $upload['headers'],
        ];
    }
}
