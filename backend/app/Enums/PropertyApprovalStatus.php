<?php

namespace App\Enums;

enum PropertyApprovalStatus: string
{
    case Draft = 'draft';
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';
}
