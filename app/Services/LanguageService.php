<?php

namespace App\Services;

use App\Models\Language;
use Illuminate\Support\Facades\DB;

class LanguageService
{
    public function getAll()
    {
        return Language::orderByDesc('is_default')
            ->orderBy('code')
            ->get();
    }

    public function create(array $data): Language
    {
        return Language::create($data);
    }

    public function toggleActive(Language $language): Language
    {
        // لا يمكن تعطيل اللغة الافتراضية
        if ($language->is_default) {
            return $language;
        }

        $language->update(['is_active' => ! $language->is_active]);

        return $language->fresh();
    }

    public function makeDefault(Language $language): void
    {
        DB::transaction(function () use ($language) {
            // أزل الافتراضي من الجميع
            Language::where('is_default', true)->update(['is_default' => false]);

            // اجعل هذه اللغة افتراضية ومفعّلة
            $language->update([
                'is_default' => true,
                'is_active'  => true,
            ]);
        });
    }

    public function delete(Language $language): void
    {
        // لا تحذف الافتراضية
        if ($language->is_default) {
            return;
        }

        $language->delete();
    }
}
