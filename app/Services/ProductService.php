<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProductService
{
    public function getAll()
    {
        return Product::query()
            ->with('category:id,name')
            ->orderBy('category_id')
            ->orderBy('order')
            ->get();
    }

    public function getCategories()
    {
        return Category::query()
            ->select('id', 'name')
            ->orderBy('order')
            ->get();
    }

    public function create(array $data, ?UploadedFile $image = null): Product
    {
        if ($image) {
            $data['image_path'] = $image->store('products', 'public');
        }

        return Product::create($data);
    }

    public function update(Product $product, array $data, ?UploadedFile $image = null): Product
    {
        if ($image) {
            $this->deleteImage($product);
            $data['image_path'] = $image->store('products', 'public');
        }

        $product->update($data);

        return $product->fresh();
    }

    public function delete(Product $product): bool
    {
        $this->deleteImage($product);

        return $product->delete();
    }

    private function deleteImage(Product $product): void
    {
        if ($product->image_path) {
            Storage::disk('public')->delete($product->image_path);
        }
    }
}
