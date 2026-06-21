import { router, useForm } from '@inertiajs/react';
import { ImageIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
import { store as categoriesStore, update as categoriesUpdate } from '@/routes/categories';

import type { Category, TranslatableLanguage } from '../types';

// ─── Types ───────────────────────────────────────────────────────────────────

type TranslationField = {
    language_id: number;
    name: string;
};

type FormData = {
    name: string;
    image_path: File | null;
    is_active: boolean;
    order: number;
    translations: TranslationField[];
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category?: Category;
    languages: TranslatableLanguage[];
};

// ─── Component ───────────────────────────────────────────────────────────────

export function CategoryFormModal({ open, onOpenChange, category, languages }: Props) {
    const { t } = useTranslation();
    const isEditing = Boolean(category);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<FormData>({
            name: '',
            image_path: null,
            is_active: true,
            order: 0,
            translations: [],
        });

    // بناء translations array من اللغات المتاحة
    function buildTranslations(cat?: Category): TranslationField[] {
        return languages.map((lang) => {
            const existing = cat?.translations.find(
                (tr) => tr.language_id === lang.id,
            );
            return {
                language_id: lang.id,
                name: existing?.name ?? '',
            };
        });
    }

    useEffect(() => {
        if (open) {
            setData({
                name: category?.name ?? '',
                image_path: null,
                is_active: category?.is_active ?? true,
                order: category?.order ?? 0,
                translations: buildTranslations(category),
            });
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }, [open, category?.id]);

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

    function setTranslationName(languageId: number, value: string) {
        setData(
            'translations',
            data.translations.map((tr) =>
                tr.language_id === languageId ? { ...tr, name: value } : tr,
            ),
        );
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (isEditing) {
            router.post(
                categoriesUpdate.url(category!.id),
                { ...data, _method: 'PUT' },
                { forceFormData: true, onSuccess: () => handleClose() },
            );
        } else {
            post(categoriesStore.url(), {
                forceFormData: true,
                onSuccess: () => handleClose(),
            });
        }
    }

    const previewSrc =
        imagePreview ?? (category?.image_path ? `/storage/${category.image_path}` : null);

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? t('categories.edit') : t('categories.add')}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* الاسم بالعربية — دائماً */}
                    <div className="space-y-1.5">
                        <Label htmlFor="cat-name">
                            {t('categories.nameField')}{' '}
                            <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="cat-name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="مثال: برغر"
                            dir="rtl"
                            aria-invalid={Boolean(errors.name)}
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* حقول الترجمة — لكل لغة إضافية */}
                    {languages.map((lang, index) => (
                        <div key={lang.id} className="space-y-1.5">
                            <Label htmlFor={`cat-name-${lang.code}`}>
                                {t('common.name')} ({lang.native_name})
                            </Label>
                            <Input
                                id={`cat-name-${lang.code}`}
                                value={data.translations[index]?.name ?? ''}
                                onChange={(e) =>
                                    setTranslationName(lang.id, e.target.value)
                                }
                                placeholder={`e.g. Burger`}
                                dir={lang.code === 'ar' ? 'rtl' : 'ltr'}
                                aria-invalid={Boolean(
                                    (errors as Record<string, string>)[
                                        `translations.${index}.name`
                                    ],
                                )}
                            />
                            <InputError
                                message={
                                    (errors as Record<string, string>)[
                                        `translations.${index}.name`
                                    ]
                                }
                            />
                        </div>
                    ))}

                    {/* Image */}
                    <div className="space-y-1.5">
                        <Label htmlFor="cat-image">{t('common.image')}</Label>
                        <div className="flex items-start gap-3">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted transition-colors hover:bg-muted/70"
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
                                    id="cat-image"
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpg,image/jpeg,image/png,image/webp"
                                    onChange={handleImageChange}
                                    className="cursor-pointer"
                                    aria-invalid={Boolean(errors.image_path)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {t('common.imageHint')}
                                    {isEditing && !imagePreview && category?.image_path && (
                                        <span className="ml-1 opacity-70">
                                            · {t('common.leaveEmptyImage')}
                                        </span>
                                    )}
                                </p>
                                <InputError message={errors.image_path} />
                            </div>
                        </div>
                    </div>

                    {/* Order */}
                    <div className="space-y-1.5">
                        <Label htmlFor="cat-order">{t('common.displayOrder')}</Label>
                        <Input
                            id="cat-order"
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
                            id="cat-active"
                            checked={data.is_active}
                            onCheckedChange={(checked) =>
                                setData('is_active', checked === true)
                            }
                        />
                        <Label htmlFor="cat-active" className="cursor-pointer">
                            {t('common.active')}
                        </Label>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={processing}
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? t('common.saving')
                                : isEditing
                                  ? t('common.saveChanges')
                                  : t('categories.add')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
