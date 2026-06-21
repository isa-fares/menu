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
            ->with('translations.language')
            ->orderBy('order')
            ->get();
    }

    public function create(array $data, ?UploadedFile $image = null): Category
    {
        if ($image) {
            $data['image_path'] = $image->store('categories', 'public');
        }

        $translations = $data['translations'] ?? [];
        unset($data['translations']);

        $category = Category::create($data);

        $this->syncTranslations($category, $translations);

        return $category;
    }

    public function update(Category $category, array $data, ?UploadedFile $image = null): Category
    {
        if ($image) {
            $this->deleteImage($category);
            $data['image_path'] = $image->store('categories', 'public');
        }

        $translations = $data['translations'] ?? [];
        unset($data['translations']);

        $category->update($data);

        $this->syncTranslations($category, $translations);

        return $category->fresh();
    }

    public function delete(Category $category): bool
    {
        $this->deleteImage($category);

        return $category->delete();
    }

    /**
     * حفظ أو تحديث الترجمات
     * كل عنصر: ['language_id' => x, 'name' => '...']
     */
    private function syncTranslations(Category $category, array $translations): void
    {
        foreach ($translations as $translation) {
            $name = trim($translation['name'] ?? '');

            if ($name === '') {
                // احذف الترجمة إذا تُركت فارغة
                $category->translations()
                    ->where('language_id', $translation['language_id'])
                    ->delete();
                continue;
            }

            $category->translations()->updateOrCreate(
                ['language_id' => $translation['language_id']],
                ['name'        => $name],
            );
        }
    }

    private function deleteImage(Category $category): void
    {
        if ($category->image_path) {
            Storage::disk('public')->delete($category->image_path);
        }
    }
}
