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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { store as productsStore, update as productsUpdate } from '@/routes/products';

import type { Category, Product } from '../types';

// ─── Types ───────────────────────────────────────────────────────────────────

type FormData = {
    category_id: number;
    name: string;
    price: string;
    description: string;
    calories: string;
    image_path: File | null;
    is_active: boolean;
    is_most_ordered: boolean;
    order: number;
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product?: Product;
    categories: Category[];
};

// ─── Component ───────────────────────────────────────────────────────────────

export function ProductFormModal({ open, onOpenChange, product, categories }: Props) {
    const isEditing = Boolean(product);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<FormData>({
            category_id: 0,
            name: '',
            price: '',
            description: '',
            calories: '',
            image_path: null,
            is_active: true,
            is_most_ordered: false,
            order: 0,
        });

    useEffect(() => {
        if (open) {
            setData({
                category_id: product?.category_id ?? (categories[0]?.id ?? 0),
                name: product?.name ?? '',
                price: product?.price ?? '',
                description: product?.description ?? '',
                calories: product?.calories?.toString() ?? '',
                image_path: null,
                is_active: product?.is_active ?? true,
                is_most_ordered: product?.is_most_ordered ?? false,
                order: product?.order ?? 0,
            });
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }, [open, product?.id]);

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
                productsUpdate.url(product!.id),
                { ...data, _method: 'PUT' },
                { forceFormData: true, onSuccess: () => handleClose() },
            );
        } else {
            post(productsStore.url(), {
                forceFormData: true,
                onSuccess: () => handleClose(),
            });
        }
    }

    const previewSrc =
        imagePreview ?? (product?.image_path ? `/storage/${product.image_path}` : null);

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit Product' : 'Add Product'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Category */}
                    <div className="space-y-1.5">
                        <Label htmlFor="prod-category">
                            Category <span className="text-destructive">*</span>
                        </Label>
                        <Select
                            value={String(data.category_id)}
                            onValueChange={(val) => setData('category_id', Number(val))}
                        >
                            <SelectTrigger id="prod-category" className="w-full" aria-invalid={Boolean(errors.category_id)}>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={String(cat.id)}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.category_id} />
                    </div>

                    {/* Name + Price */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="prod-name">
                                Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="prod-name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g. Cheeseburger"
                                aria-invalid={Boolean(errors.name)}
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="prod-price">
                                Price <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="prod-price"
                                type="text"
                                inputMode="decimal"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                placeholder="0.00"
                                aria-invalid={Boolean(errors.price)}
                            />
                            <InputError message={errors.price} />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <Label htmlFor="prod-desc">Description</Label>
                        <textarea
                            id="prod-desc"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Optional description..."
                            rows={2}
                            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-[60px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                        />
                        <InputError message={errors.description} />
                    </div>

                    {/* Calories + Order */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="prod-calories">Calories</Label>
                            <Input
                                id="prod-calories"
                                type="text"
                                inputMode="numeric"
                                value={data.calories}
                                onChange={(e) => setData('calories', e.target.value.replace(/[^0-9]/g, ''))}
                                placeholder="e.g. 450"
                                aria-invalid={Boolean(errors.calories)}
                            />
                            <InputError message={errors.calories} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="prod-order">Display Order</Label>
                            <Input
                                id="prod-order"
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
                    </div>

                    {/* Image */}
                    <div className="space-y-1.5">
                        <Label htmlFor="prod-image">Image</Label>
                        <div className="flex items-start gap-3">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted transition-colors hover:bg-muted/70"
                            >
                                {previewSrc ? (
                                    <img src={previewSrc} alt="Preview" className="size-full object-cover" />
                                ) : (
                                    <ImageIcon className="size-6 text-muted-foreground" />
                                )}
                            </button>
                            <div className="flex-1 space-y-1">
                                <Input
                                    id="prod-image"
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpg,image/jpeg,image/png,image/webp"
                                    onChange={handleImageChange}
                                    className="cursor-pointer"
                                    aria-invalid={Boolean(errors.image_path)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    JPG, PNG or WebP · max 2 MB
                                    {isEditing && !imagePreview && product?.image_path && (
                                        <span className="ml-1 text-muted-foreground/70">· leave empty to keep current</span>
                                    )}
                                </p>
                                <InputError message={errors.image_path} />
                            </div>
                        </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="prod-active"
                                checked={data.is_active}
                                onCheckedChange={(checked) => setData('is_active', checked === true)}
                            />
                            <Label htmlFor="prod-active" className="cursor-pointer">Active</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="prod-most-ordered"
                                checked={data.is_most_ordered}
                                onCheckedChange={(checked) => setData('is_most_ordered', checked === true)}
                            />
                            <Label htmlFor="prod-most-ordered" className="cursor-pointer">Most Ordered</Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Product'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
