<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSliderRequest;
use App\Http\Requests\UpdateSliderRequest;
use App\Models\Slider;
use App\Services\SliderService;
use Inertia\Inertia;

class SliderController extends Controller
{
    public function __construct(
        private SliderService $sliderService
    ) {}

    public function index()
    {
        return Inertia::render('sliders/index', [
            'sliders' => $this->sliderService->getAll(),
        ]);
    }

    public function store(StoreSliderRequest $request)
    {
        $this->sliderService->create(
            $request->safe()->except('image_path'),
            $request->file('image_path'),
        );

        return redirect()
            ->route('sliders.index')
            ->with('toast', ['type' => 'success', 'message' => 'Slider created successfully']);
    }

    public function update(UpdateSliderRequest $request, Slider $slider)
    {
        $this->sliderService->update(
            $slider,
            $request->safe()->except('image_path'),
            $request->file('image_path'),
        );

        return redirect()
            ->route('sliders.index')
            ->with('toast', ['type' => 'success', 'message' => 'Slider updated successfully']);
    }

    public function destroy(Slider $slider)
    {
        $this->sliderService->delete($slider);

        return redirect()
            ->route('sliders.index')
            ->with('toast', ['type' => 'success', 'message' => 'Slider deleted successfully']);
    }
}
