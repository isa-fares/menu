<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use App\Services\ProductService;
use Inertia\Inertia;

class ProductsController extends Controller
{
    public function __construct(
        private ProductService $productService
    ) {}

    public function index()
    {
        return Inertia::render('products/index', [
            'products'   => $this->productService->getAll(),
            'categories' => $this->productService->getCategories(),
        ]);
    }

    public function store(StoreProductRequest $request)
    {
        $this->productService->create(
            $request->safe()->except('image_path'),
            $request->file('image_path'),
        );

        return redirect()
            ->route('products.index')
            ->with('toast', ['type' => 'success', 'message' => 'Product created successfully']);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $this->productService->update(
            $product,
            $request->safe()->except('image_path'),
            $request->file('image_path'),
        );

        return redirect()
            ->route('products.index')
            ->with('toast', ['type' => 'success', 'message' => 'Product updated successfully']);
    }

    public function destroy(Product $product)
    {
        $this->productService->delete($product);

        return redirect()
            ->route('products.index')
            ->with('toast', ['type' => 'success', 'message' => 'Product deleted successfully']);
    }
}
