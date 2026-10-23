<?php

namespace App\Http\Controllers\Api\V1\System;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class HealthController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'service' => 'investormart-api',
                'status' => 'ok',
                'version' => 'v1',
                'timestamp' => now()->toIso8601String(),
            ],
        ]);
    }
}
