<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id'    => ['required', 'integer', 'exists:categories,id'],
            'name'           => ['required', 'string', 'max:255'],
            'price'          => ['required', 'numeric', 'min:0'],
            'description'    => ['nullable', 'string'],
            'calories'       => ['nullable', 'integer', 'min:0'],
            'image_path'     => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'is_active'      => ['boolean'],
            'is_most_ordered'=> ['boolean'],
            'order'          => ['integer'],
        ];
    }
}
