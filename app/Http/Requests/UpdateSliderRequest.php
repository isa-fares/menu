<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSliderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'image_path' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'order'      => ['integer'],
            'is_active'  => ['boolean'],
        ];
    }
}
