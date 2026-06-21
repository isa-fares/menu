<?php

namespace Database\Seeders;

use App\Models\Language;
use Illuminate\Database\Seeder;

class LanguageSeeder extends Seeder
{
    public function run(): void
    {
        $languages = [
            [
                'code'        => 'ar',
                'name'        => 'Arabic',
                'native_name' => 'العربية',
                'dir'         => 'rtl',
                'is_active'   => true,
                'is_default'  => true,
            ],
            [
                'code'        => 'en',
                'name'        => 'English',
                'native_name' => 'English',
                'dir'         => 'ltr',
                'is_active'   => true,
                'is_default'  => false,
            ],
            [
                'code'        => 'tr',
                'name'        => 'Turkish',
                'native_name' => 'Türkçe',
                'dir'         => 'ltr',
                'is_active'   => true,
                'is_default'  => false,
            ],
        ];

        foreach ($languages as $lang) {
            Language::updateOrCreate(
                ['code' => $lang['code']],
                array_merge($lang, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]),
            );
        }
    }
}
