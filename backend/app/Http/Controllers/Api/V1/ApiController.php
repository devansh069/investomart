<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

abstract class ApiController extends Controller
{
    /** @param array<string, mixed>|array<int, mixed>|null $data */
    protected function success(?array $data = null, ?string $message = null, int $status = 200, array $meta = []): JsonResponse
    {
        return response()->json(array_filter([
            'success' => true,
            'data' => $data,
            'message' => $message,
            'meta' => $meta === [] ? null : $meta,
        ], static fn (mixed $value): bool => $value !== null), $status);
    }

    protected function failure(string $message, string $code, int $status = 400, array $errors = []): JsonResponse
    {
        return response()->json(array_filter([
            'success' => false,
            'message' => $message,
            'code' => $code,
            'errors' => $errors === [] ? null : $errors,
        ], static fn (mixed $value): bool => $value !== null), $status);
    }
}
