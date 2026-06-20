<?php

namespace App\Services;

use App\Models\Slider;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class SliderService
{
    public function getAll()
    {
        return Slider::query()->orderBy('order')->get();
    }

    public function create(array $data, UploadedFile $image): Slider
    {
        if($image){

            $data['image_path'] = $image->store('sliders', 'public');
            return Slider::create($data);
            
        }
    }

    public function update(Slider $slider, array $data, ?UploadedFile $image = null): Slider
    {
        if ($image) {
            $this->deleteImage($slider);
            $data['image_path'] = $image->store('sliders', 'public');
        }
        $slider->update($data);
        return $slider->fresh();
    }

    public function delete(Slider $slider): bool
    {
        $this->deleteImage($slider);
        return $slider->delete();
    }

    private function deleteImage(Slider $slider): void
    {
        if ($slider->image_path) {
            Storage::disk('public')->delete($slider->image_path);
        }
    }
}
