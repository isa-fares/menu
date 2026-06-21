<?php

namespace App\Http\Controllers;

use App\Models\Language;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class TranslationsController extends Controller
{
    /**
     * مسار مجلد ملفات الترجمة
     */
    private function localesPath(): string
    {
        return resource_path('js/locales');
    }

    /**
     * قراءة ملف JSON وتحويله إلى مصفوفة مسطحة (flat)
     * مثال: ['common.add' => 'Add', 'nav.dashboard' => 'Dashboard']
     */
    private function readFlat(string $code): array
    {
        $path = $this->localesPath() . "/{$code}.json";

        if (! File::exists($path)) {
            return [];
        }

        $data = json_decode(File::get($path), true) ?? [];

        return $this->flatten($data);
    }

    /**
     * تسطيح المصفوفة المتداخلة
     */
    private function flatten(array $array, string $prefix = ''): array
    {
        $result = [];
        foreach ($array as $key => $value) {
            $fullKey = $prefix ? "{$prefix}.{$key}" : $key;
            if (is_array($value)) {
                $result = array_merge($result, $this->flatten($value, $fullKey));
            } else {
                $result[$fullKey] = $value;
            }
        }
        return $result;
    }

    /**
     * تحويل المصفوفة المسطحة إلى متداخلة
     */
    private function unflatten(array $flat): array
    {
        $result = [];
        foreach ($flat as $key => $value) {
            $keys = explode('.', $key);
            $ref  = &$result;
            foreach ($keys as $k) {
                if (! isset($ref[$k]) || ! is_array($ref[$k])) {
                    $ref[$k] = [];
                }
                $ref = &$ref[$k];
            }
            $ref = $value;
        }
        return $result;
    }

    public function index(Request $request)
    {
        // اللغات الفعالة فقط
        $languages = Language::where('is_active', true)
            ->orderByDesc('is_default')
            ->orderBy('code')
            ->get(['id', 'code', 'name', 'native_name', 'is_default']);

        // اللغة المختارة (من query string أو الافتراضية)
        $selectedCode = $request->query('lang',
            $languages->firstWhere('is_default', true)?->code ?? 'ar'
        );

        // تأكد أن اللغة المختارة فعالة
        if (! $languages->contains('code', $selectedCode)) {
            $selectedCode = $languages->first()?->code ?? 'ar';
        }

        // اقرأ ملف اللغة المرجعية (الافتراضية) — لإظهار المفاتيح دائماً
        $defaultCode  = $languages->firstWhere('is_default', true)?->code ?? 'ar';
        $defaultFlat  = $this->readFlat($defaultCode);

        // اقرأ ملف اللغة المختارة
        $selectedFlat = $this->readFlat($selectedCode);

        // اجمع المفاتيح من الافتراضية مع قيم المختارة
        $entries = [];
        foreach ($defaultFlat as $key => $defaultValue) {
            $entries[] = [
                'key'           => $key,
                'default_value' => $defaultValue,          // قيمة اللغة المرجعية
                'value'         => $selectedFlat[$key] ?? '', // قيمة اللغة المختارة
            ];
        }

        return Inertia::render('translations/index', [
            'languages'     => $languages,
            'selected_code' => $selectedCode,
            'entries'       => $entries,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'code'    => ['required', 'string', 'max:10'],
            'entries' => ['required', 'array'],
            'entries.*.key'   => ['required', 'string'],
            'entries.*.value' => ['nullable', 'string'],
        ]);

        $code = $request->input('code');

        // تأكد أن اللغة فعالة
        $exists = Language::where('code', $code)->where('is_active', true)->exists();
        if (! $exists) {
            return back()->with('toast', ['type' => 'error', 'message' => 'Language not found']);
        }

        // حوّل entries إلى flat array
        $flat = [];
        foreach ($request->input('entries') as $entry) {
            $flat[$entry['key']] = $entry['value'] ?? '';
        }

        // حوّل إلى nested وأكتب الملف
        $nested = $this->unflatten($flat);
        $path   = $this->localesPath() . "/{$code}.json";

        File::put($path, json_encode($nested, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

        return back()->with('toast', ['type' => 'success', 'message' => "Translations saved for {$code}"]);
    }
}
