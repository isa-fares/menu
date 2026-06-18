<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('sliders', 'sliders')->name('sliders');
    Route::inertia('categories', 'categories')->name('categories');
    Route::inertia('products', 'products')->name('products');
});

require __DIR__.'/settings.php';
