<?php

namespace App\Enums;

enum PropertyProviderStatus: string
{
    case Active = 'active';
    case Paused = 'paused';
    case Archived = 'archived';
}
