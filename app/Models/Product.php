<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $category_id
 * @property string $name
 * @property string $price
 * @property bool $is_active
 * @property bool $is_most_ordered
 * @property int $order
 * @property string|null $description
 * @property int|null $calories
 * @property string|null $image_path
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Category $category
 */
class Product extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'price',
        'is_active',
        'is_most_ordered',
        'order',
        'description',
        'calories',
        'image_path',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'category_id' => 'integer',
            'price' => 'decimal:2',
            'is_active' => 'boolean',
            'is_most_ordered' => 'boolean',
            'order' => 'integer',
            'calories' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<Category, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
