<?php

namespace App\Enums;

enum ProviderType: string
{
    case Builder = 'builder';
    case Owner = 'owner';
    case Broker = 'broker';
}
