import { router, useForm } from '@inertiajs/react';
import { ImageIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { store as slidersStore, update as slidersUpdate } from '@/routes/sliders';

import type { Slider } from '../types';

// ─── Types ───────────────────────────────────────────────────────────────────

type FormData = {
    image_path: File | null;
    is_active: boolean;
    order: number;
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    slider?: Slider;
};

// ─── Component ───────────────────────────────────────────────────────────────

export function SliderFormModal({ open, onOpenChange, slider }: Props) {
    const isEditing = Boolean(slider);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<FormData>({
            image_path: null,
            is_active: true,
            order: 0,
        });

    // مزامنة البيانات عند فتح الـ modal أو تغيير الـ slider
    useEffect(() => {
        if (open) {
            setData({
                image_path: null,
                is_active: slider?.is_active ?? true,
                order: slider?.order ?? 0,
            });
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }, [open, slider?.id]);

    function handleClose() {
        reset();
        clearErrors();
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        onOpenChange(false);
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        setData('image_path', file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (isEditing) {
            router.post(
                slidersUpdate.url(slider!.id),
                { ...data, _method: 'PUT' },
                { forceFormData: true, onSuccess: () => handleClose() },
            );
        } else {
            post(slidersStore.url(), {
                forceFormData: true,
                onSuccess: () => handleClose(),
            });
        }
    }

    const previewSrc =
        imagePreview ?? (slider?.image_path ? `/storage/${slider.image_path}` : null);

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit Slider' : 'Add Slider'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Image */}
                    <div className="space-y-1.5">
                        <Label htmlFor="slider-image">
                            Image {!isEditing && <span className="text-destructive">*</span>}
                        </Label>
                        <div className="flex items-start gap-3">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted transition-colors hover:bg-muted/70"
                            >
                                {previewSrc ? (
                                    <img
                                        src={previewSrc}
                                        alt="Preview"
                                        className="size-full object-cover"
                                    />
                                ) : (
                                    <ImageIcon className="size-6 text-muted-foreground" />
                                )}
                            </button>
                            <div className="flex-1 space-y-1">
                                <Input
                                    id="slider-image"
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpg,image/jpeg,image/png,image/webp"
                                    onChange={handleImageChange}
                                    className="cursor-pointer"
                                    aria-invalid={Boolean(errors.image_path)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    JPG, PNG or WebP · max 2 MB
                                    {isEditing && !imagePreview && (
                                        <span className="ml-1 text-muted-foreground/70">
                                            · leave empty to keep current image
                                        </span>
                                    )}
                                </p>
                                <InputError message={errors.image_path} />
                            </div>
                        </div>
                    </div>

                    {/* Order */}
                    <div className="space-y-1.5">
                        <Label htmlFor="slider-order">Display Order</Label>
                        <Input
                            id="slider-order"
                            type="text"
                            inputMode="numeric"
                            value={data.order}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9]/g, '');
                                setData('order', val === '' ? 0 : Number(val));
                            }}
                            placeholder="0"
                            aria-invalid={Boolean(errors.order)}
                        />
                        <InputError message={errors.order} />
                    </div>

                    {/* Is Active */}
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="slider-active"
                            checked={data.is_active}
                            onCheckedChange={(checked) =>
                                setData('is_active', checked === true)
                            }
                        />
                        <Label htmlFor="slider-active" className="cursor-pointer">
                            Active
                        </Label>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || (!isEditing && !data.image_path)}
                        >
                            {processing
                                ? 'Saving…'
                                : isEditing
                                  ? 'Save Changes'
                                  : 'Add Slider'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
