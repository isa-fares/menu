<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'                       => ['required', 'string', 'max:255'],
            'image_path'                 => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'is_active'                  => ['boolean'],
            'order'                      => ['integer'],
            'translations'               => ['nullable', 'array'],
            'translations.*.language_id' => ['required', 'integer', 'exists:languages,id'],
            'translations.*.name'        => ['nullable', 'string', 'max:255'],
        ];
    }
}
