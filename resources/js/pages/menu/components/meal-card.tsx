import { Link } from '@inertiajs/react';
import { Flame } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCartStore } from '@/stores/cart-store';
import { useContentTranslations } from '@/hooks/use-content-translations';
import type { Product } from '../types';

type Props = {
    product: Product;
};

export function MealCard({ product }: Props) {
    const { i18n, t } = useTranslation();
    const { getName } = useContentTranslations();
    const { items, addItem, increaseQty, decreaseQty } = useCartStore();
    const [zoom, setZoom] = useState(false);

    const name  = getName(product, i18n.language);
    const price = Number(product.price);
    const image = product.image_path ? `/storage/${product.image_path}` : '/images/placeholder.webp';
    const cartItem = items.find((i) => i.id === product.id);
    const qty = cartItem?.quantity ?? 0;

    function handleAdd() {
        addItem({ id: product.id, name, price, image: product.image_path });
    }

    return (
        <>
            <div className="flex w-full flex-col overflow-hidden rounded-md border border-black/10 bg-white shadow-md">
                {/* صورة */}
                <div
                    className="relative h-40 cursor-zoom-in overflow-hidden"
                    onClick={() => setZoom(true)}
                >
                    <img
                        src={image}
                        alt={name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    {product.is_most_ordered && (
                        <span className="absolute start-2 top-2 rounded-full bg-[var(--menu-main)] px-2 py-0.5 text-[10px] font-bold text-white">
                            ⭐ {t('popularMeals.title')}
                        </span>
                    )}
                </div>

                <div className="flex flex-1 flex-col gap-1.5 p-3">
                    {/* الاسم */}
                    <Link
                        href={`/product/${product.id}`}
                        className="line-clamp-2 text-base font-semibold text-gray-800 hover:text-[var(--menu-main)]"
                    >
                        {name}
                    </Link>

                    {/* السعرات */}
                    {product.calories && (
                        <p className="flex items-center gap-1 text-xs text-gray-500">
                            <Flame className="size-3 text-orange-400" />
                            {product.calories} {t('meal.calories')}
                        </p>
                    )}

                    <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                        {/* السعر */}
                        <span className="text-base font-bold text-[var(--menu-main)]">
                            {price.toFixed(2)}
                        </span>

                        {/* زر الإضافة / الكمية */}
                        {qty === 0 ? (
                            <button
                                onClick={handleAdd}
                                className="rounded-md bg-[var(--menu-main)] px-3 py-1 text-sm font-bold text-white transition hover:bg-[var(--menu-main-secondary)]"
                            >
                                + {t('common.add')}
                            </button>
                        ) : (
                            <div className="flex items-center overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                                <button
                                    onClick={() => decreaseQty(product.id)}
                                    className="px-2.5 py-1 text-sm font-bold text-gray-700 hover:bg-gray-200"
                                >
                                    −
                                </button>
                                <span className="min-w-[24px] text-center text-sm font-bold">
                                    {qty}
                                </span>
                                <button
                                    onClick={() => increaseQty(product.id)}
                                    className="px-2.5 py-1 text-sm font-bold text-gray-700 hover:bg-gray-200"
                                >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Image Zoom Overlay */}
            {zoom && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm"
                    onClick={() => setZoom(false)}
                >
                    <img
                        src={image}
                        alt={name}
                        className="max-h-[90%] max-w-[90%] rounded-lg shadow-2xl"
                    />
                </div>
            )}
        </>
    );
}
