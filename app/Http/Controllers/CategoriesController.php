<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use App\Models\Language;
use App\Services\CategoryService;
use Inertia\Inertia;

class CategoriesController extends Controller
{
    public function __construct(
        private CategoryService $categoryService
    ) {}

    public function index()
    {
        return Inertia::render('categories/index', [
            'categories'          => $this->categoryService->getAll(),
            // اللغات غير الافتراضية — لها حقول ترجمة في الفورم
            'translatable_languages' => Language::where('is_active', true)
                ->where('is_default', false)
                ->orderBy('code')
                ->get(['id', 'code', 'name', 'native_name']),
        ]);
    }

    public function store(StoreCategoryRequest $request)
    {
        $this->categoryService->create(
            $request->safe()->except('image_path'),
            $request->file('image_path'),
        );

        return to_route('categories.index')
            ->with('toast', ['type' => 'success', 'message' => 'Category created successfully']);
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $this->categoryService->update(
            $category,
            $request->safe()->except('image_path'),
            $request->file('image_path'),
        );

        return to_route('categories.index')
            ->with('toast', ['type' => 'success', 'message' => 'Category updated successfully']);
    }

    public function destroy(Category $category)
    {
        $this->categoryService->delete($category);

        return to_route('categories.index')
            ->with('toast', ['type' => 'success', 'message' => 'Category deleted successfully']);
    }
}
