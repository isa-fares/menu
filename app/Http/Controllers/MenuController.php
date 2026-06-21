<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Language;
use App\Models\Product;
use App\Models\Slider;
use Inertia\Inertia;

class MenuController extends Controller
{
    public function index()
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->with([
                'translations.language',
                'products' => fn ($q) => $q
                    ->where('is_active', true)
                    ->with('translations.language')
                    ->orderBy('order'),
            ])
            ->orderBy('order')
            ->get();

        $popularMeals = Product::query()
            ->where('is_active', true)
            ->where('is_most_ordered', true)
            ->with('translations.language')
            ->orderBy('order')
            ->get();

        $sliders = Slider::query()
            ->where('is_active', true)
            ->orderBy('order')
            ->get();

        $enabledLocales = Language::where('is_active', true)
            ->orderByDesc('is_default')
            ->orderBy('code')
            ->get(['code', 'name', 'native_name', 'dir', 'is_default']);

        return Inertia::render('menu/index', [
            'categories'    => $categories,
            'popularMeals'  => $popularMeals,
            'sliders'       => $sliders,
            'enabledLocales' => $enabledLocales,
        ]);
    }

    public function product(int $id)
    {
        $product = Product::with('translations.language', 'category')
            ->where('is_active', true)
            ->findOrFail($id);

        $related = Product::query()
            ->where('is_active', true)
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->with('translations.language')
            ->orderBy('order')
            ->limit(6)
            ->get();

        $enabledLocales = Language::where('is_active', true)
            ->orderByDesc('is_default')
            ->orderBy('code')
            ->get(['code', 'name', 'native_name', 'dir', 'is_default']);

        return Inertia::render('menu/product', [
            'product'        => $product,
            'relatedProducts' => $related,
            'enabledLocales'  => $enabledLocales,
        ]);
    }
}
