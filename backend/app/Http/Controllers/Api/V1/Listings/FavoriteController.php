<?php

namespace App\Http\Controllers\Api\V1\Listings;

use App\Http\Controllers\Api\V1\ApiController;
use App\Models\ListingFavorite;
use App\Services\Listings\CatalogueService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavoriteController extends ApiController
{
    public function index(Request $request, CatalogueService $catalogue): JsonResponse
    {
        $favorites = ListingFavorite::query()->where('account_id', $request->user()->id)->latest()->get();
        $listings = $favorites->map(fn (ListingFavorite $favorite) => $catalogue->find($favorite->listing_source, $favorite->listing_id))->filter()->values();

        return $this->success(['listings' => $listings]);
    }

    public function toggle(Request $request, string $source, string $id, CatalogueService $catalogue): JsonResponse
    {
        if ($catalogue->find($source, $id) === null) {
            return $this->failure('Property not found.', 'LISTING_NOT_FOUND', 404);
        }

        $favorite = ListingFavorite::query()->where([
            'account_id' => $request->user()->id, 'listing_source' => $source, 'listing_id' => $id,
        ])->first();

        if ($favorite !== null) {
            $favorite->delete();

            return $this->success(['is_favorite' => false]);
        }

        ListingFavorite::query()->create([
            'account_id' => $request->user()->id, 'listing_source' => $source, 'listing_id' => $id,
        ]);

        return $this->success(['is_favorite' => true], 'Property saved.');
    }
}
