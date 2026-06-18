<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class CategoryService
{
    public function getAll()
    {
        return Category::query()
            ->orderBy('order')
            ->get();
    }

    public function create(array $data, ?UploadedFile $image = null): Category
    {
        if ($image) {
            $data['image_path'] = $image->store('categories', 'public');
        }

        return Category::create($data);
    }

    public function update(Category $category, array $data, ?UploadedFile $image = null): Category
    {
        if ($image) {
            $this->deleteImage($category);
            $data['image_path'] = $image->store('categories', 'public');
        }

        $category->update($data);

        return $category->fresh();
    }

    public function delete(Category $category): bool
    {
        $this->deleteImage($category);

        return $category->delete();
    }

    private function deleteImage(Category $category): void
    {
        if ($category->image_path) {
            Storage::disk('public')->delete($category->image_path);
        }
    }
}
