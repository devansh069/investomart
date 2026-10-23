<?php

namespace App\Contracts\Storage;

interface MediaStorage
{
    /**
     * @return array{upload_url: string, object_key: string, expires_at: string}
     */
    public function createUploadUrl(string $objectKey, string $contentType, int $expiresInSeconds = 900): array;
}
