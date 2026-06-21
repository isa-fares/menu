<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLanguageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code'        => ['required', 'string', 'max:10', 'unique:languages,code'],
            'name'        => ['required', 'string', 'max:100'],
            'native_name' => ['required', 'string', 'max:100'],
            'dir'         => ['required', 'in:ltr,rtl'],
            'is_active'   => ['boolean'],
        ];
    }
}
