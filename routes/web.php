<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoriesController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('sliders', 'sliders')->name('sliders');
    Route::inertia('products', 'products')->name('products');

    Route::resource('categories', CategoriesController::class)->only([
        'index', 'store', 'update', 'destroy',
    ]);
});

require __DIR__.'/settings.php';
