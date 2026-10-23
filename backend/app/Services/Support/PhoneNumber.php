<?php

namespace App\Services\Support;

use Illuminate\Validation\ValidationException;

class PhoneNumber
{
    /** @return array{country_code: string, phone: string} */
    public static function normalize(string $raw, string $countryCode = '+91'): array
    {
        $digits = preg_replace('/\D+/', '', $raw) ?? '';

        if (str_starts_with($digits, '91') && strlen($digits) === 12) {
            $digits = substr($digits, 2);
        }

        if (! preg_match('/^[6-9][0-9]{9}$/', $digits)) {
            throw ValidationException::withMessages([
                'phone' => ['Enter a valid 10-digit Indian mobile number.'],
            ]);
        }

        return ['country_code' => $countryCode, 'phone' => $digits];
    }
}
