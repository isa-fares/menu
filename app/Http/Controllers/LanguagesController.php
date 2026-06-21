<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLanguageRequest;
use App\Models\Language;
use App\Services\LanguageService;
use Inertia\Inertia;

class LanguagesController extends Controller
{
    public function __construct(
        private LanguageService $languageService
    ) {}

    public function index()
    {
        return Inertia::render('languages/index', [
            'languages' => $this->languageService->getAll(),
        ]);
    }

    public function store(StoreLanguageRequest $request)
    {
        $this->languageService->create(
            array_merge($request->validated(), ['is_default' => false])
        );

        return to_route('languages.index')
            ->with('toast', ['type' => 'success', 'message' => 'Language added successfully']);
    }

    public function toggleActive(Language $language)
    {
        $this->languageService->toggleActive($language);

        return back()->with('toast', [
            'type'    => 'success',
            'message' => 'Language status updated',
        ]);
    }

    public function makeDefault(Language $language)
    {
        $this->languageService->makeDefault($language);

        return back()->with('toast', [
            'type'    => 'success',
            'message' => "{$language->native_name} is now the default language",
        ]);
    }

    public function destroy(Language $language)
    {
        if ($language->is_default) {
            return back()->with('toast', [
                'type'    => 'error',
                'message' => 'Cannot delete the default language',
            ]);
        }

        $this->languageService->delete($language);

        return to_route('languages.index')
            ->with('toast', ['type' => 'success', 'message' => 'Language deleted successfully']);
    }
}
