<?php

namespace App\Http\Controllers\Api\V1\Listings;

use App\Http\Controllers\Api\V1\ApiController;
use App\Services\Listings\CatalogueService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicListingController extends ApiController
{
    public function index(Request $request, CatalogueService $catalogue): JsonResponse
    {
        $page = $catalogue->publicPage($request);

        return $this->success($page->items(), null, 200, ['pagination' => [
            'page' => $page->currentPage(), 'per_page' => $page->perPage(), 'total' => $page->total(), 'last_page' => $page->lastPage(),
        ]]);
    }

    public function show(string $source, string $id, CatalogueService $catalogue): JsonResponse
    {
        $listing = $catalogue->find($source, $id);

        return $listing === null ? $this->failure('Property not found.', 'LISTING_NOT_FOUND', 404) : $this->success(['listing' => $listing]);
    }
}
