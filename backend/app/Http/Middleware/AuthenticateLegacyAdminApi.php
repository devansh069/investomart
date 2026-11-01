<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateLegacyAdminApi
{
    public function handle(Request $request, Closure $next): Response
    {
        $configuredKey = (string) config('services.admin.api_key');
        $providedKey = (string) $request->header('X-Admin-API-Key');
        $adminId = $request->header('X-Admin-User-Id');

        if ($configuredKey === '' || $providedKey === '' || ! hash_equals($configuredKey, $providedKey) || ! ctype_digit((string) $adminId)) {
            return response()->json(['success' => false, 'message' => 'Invalid admin API credentials.', 'code' => 'UNAUTHENTICATED'], 401);
        }

        $admin = DB::table('tbl_users')->where('user_id', (int) $adminId)->where('status', 1)->first();
        $canApprove = $admin !== null && ($admin->roleid === 'admin' || (int) ($admin->property_approve ?? 0) === 1);
        if (! $canApprove) {
            return response()->json(['success' => false, 'message' => 'This admin is not allowed to approve properties.', 'code' => 'FORBIDDEN'], 403);
        }

        $request->attributes->set('legacy_admin', $admin);

        return $next($request);
    }
}
