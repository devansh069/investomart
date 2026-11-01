<?php

namespace App\Http\Controllers\Api\V1\Listings;

use App\Http\Controllers\Api\V1\ApiController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PropertyMasterController extends ApiController
{
    public function categories(): JsonResponse
    {
        return $this->success(['categories' => DB::table('property_cat')->select('id', 'name', 'type')->orderBy('name')->get()]);
    }

    public function cities(): JsonResponse
    {
        return $this->success(['cities' => DB::table('city')->select('id', 'city')->orderBy('city')->get()]);
    }

    public function localities(Request $request, int $cityId): JsonResponse
    {
        return $this->success(['localities' => DB::table('localities')
            ->where('lcity', (string) $cityId)
            ->select('lid as id', 'lname as name')
            ->orderBy('lname')
            ->get()]);
    }

    public function projects(Request $request): JsonResponse
    {
        $query = DB::table('bilder_proj')->where('status', 1)->select('pid as id', 'pname as name', 'bid as builder_id');
        if ($request->filled('search')) {
            $query->where('pname', 'like', '%'.trim((string) $request->input('search')).'%');
        }

        return $this->success(['projects' => $query->orderBy('pname')->limit(50)->get()]);
    }

    public function amenities(): JsonResponse
    {
        return $this->success(['amenities' => DB::table('amenities')->select('id', 'name', 'type')->orderBy('name')->get()]);
    }
}
