<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $code
 * @property string $name
 * @property string $native_name
 * @property string $dir
 * @property bool $is_active
 * @property bool $is_default
 */
class Language extends Model
{
    protected $fillable = [
        'code',
        'name',
        'native_name',
        'dir',
        'is_active',
        'is_default',
    ];

    protected function casts(): array
    {
        return [
            'is_active'  => 'boolean',
            'is_default' => 'boolean',
        ];
    }
}
