<?php

use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\LanguagesController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\SliderController;
use App\Http\Controllers\TranslationsController;
use Illuminate\Support\Facades\Route;

Route::get('/', [MenuController::class, 'index'])->name('home');
Route::get('/product/{id}', [MenuController::class, 'product'])->name('menu.product');

// تغيير لغة التطبيق
Route::get('/locale/{locale}', function (string $locale) {
    $exists = \App\Models\Language::where('code', $locale)
        ->where('is_active', true)
        ->exists();

    if ($exists) {
        session(['locale' => $locale]);
    }

    return redirect()->back();
})->name('locale.switch');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::resource('sliders', SliderController::class)->only([
        'index', 'store', 'update', 'destroy',
    ]);
    Route::resource('categories', CategoriesController::class)->only([
        'index', 'store', 'update', 'destroy',
    ]);
    Route::resource('products', ProductsController::class)->only([
        'index', 'store', 'update', 'destroy',
    ]);
    Route::resource('languages', LanguagesController::class)->only([
        'index', 'store', 'destroy',
    ]);
    Route::patch('languages/{language}/toggle-active', [LanguagesController::class, 'toggleActive'])
        ->name('languages.toggle-active');
    Route::patch('languages/{language}/make-default', [LanguagesController::class, 'makeDefault'])
        ->name('languages.make-default');

    Route::get('translations', [TranslationsController::class, 'index'])->name('translations.index');
    Route::put('translations', [TranslationsController::class, 'update'])->name('translations.update');
});

require __DIR__.'/settings.php';
