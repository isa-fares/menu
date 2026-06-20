<?php

use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\SliderController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

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
});

require __DIR__.'/settings.php';
