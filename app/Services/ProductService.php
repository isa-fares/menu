<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Language;
use App\Models\Product;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProductService
{
    public function getAll()
    {
        return Product::query()
            ->with('category:id,name', 'translations.language')
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

    public function getTranslatableLanguages()
    {
        return Language::where('is_active', true)
            ->where('is_default', false)
            ->orderBy('code')
            ->get(['id', 'code', 'name', 'native_name']);
    }

    public function create(array $data, ?UploadedFile $image = null): Product
    {
        if ($image) {
            $data['image_path'] = $image->store('products', 'public');
        }

        $translations = $data['translations'] ?? [];
        unset($data['translations']);

        $product = Product::create($data);

        $this->syncTranslations($product, $translations);

        return $product;
    }

    public function update(Product $product, array $data, ?UploadedFile $image = null): Product
    {
        if ($image) {
            $this->deleteImage($product);
            $data['image_path'] = $image->store('products', 'public');
        }

        $translations = $data['translations'] ?? [];
        unset($data['translations']);

        $product->update($data);

        $this->syncTranslations($product, $translations);

        return $product->fresh();
    }

    public function delete(Product $product): bool
    {
        $this->deleteImage($product);

        return $product->delete();
    }

    private function syncTranslations(Product $product, array $translations): void
    {
        foreach ($translations as $translation) {
            $name        = trim($translation['name'] ?? '');
            $description = trim($translation['description'] ?? '');
            $langId      = $translation['language_id'];

            if ($name === '' && $description === '') {
                $product->translations()->where('language_id', $langId)->delete();
                continue;
            }

            $product->translations()->updateOrCreate(
                ['language_id' => $langId],
                array_filter([
                    'name'        => $name ?: null,
                    'description' => $description ?: null,
                ], fn ($v) => $v !== null),
            );
        }
    }

    private function deleteImage(Product $product): void
    {
        if ($product->image_path) {
            Storage::disk('public')->delete($product->image_path);
        }
    }
}
