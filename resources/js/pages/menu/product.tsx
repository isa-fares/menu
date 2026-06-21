import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Flame } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCartStore } from '@/stores/cart-store';
import { useContentTranslations } from '@/hooks/use-content-translations';
import { CartModal } from './components/cart-modal';
import { CartSummary } from './components/cart-summary';
import { MealCard } from './components/meal-card';
import type { ProductPageProps } from './types';

export default function ProductPage({ product, relatedProducts, enabledLocales }: ProductPageProps) {
    const { t, i18n } = useTranslation();
    const { getName, getDescription } = useContentTranslations();
    const { items, addItem, increaseQty, decreaseQty } = useCartStore();
    const [cartOpen, setCartOpen] = useState(false);

    const name        = getName(product, i18n.language);
    const description = getDescription(product, i18n.language);
    const price       = Number(product.price);
    const image       = product.image_path
        ? `/storage/${product.image_path}`
        : '/images/placeholder.webp';

    const cartItem = items.find((i) => i.id === product.id);
    const qty      = cartItem?.quantity ?? 0;

    function handleAdd() {
        addItem({ id: product.id, name, price, image: product.image_path });
    }

    return (
        <>
            <Head title={name} />

            <div className="min-h-screen bg-zinc-100">
                <div className="relative mx-auto min-h-screen max-w-xl bg-white">
                    {/* Hero — صورة المنتج */}
                    <div className="relative h-96 w-full overflow-hidden">
                        <img src={image} alt={name} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-black/20" />

                        {/* زر رجوع */}
                        <Link
                            href="/"
                            className="absolute start-4 top-4 flex size-9 items-center justify-center rounded-full bg-white/90 shadow backdrop-blur-sm transition hover:bg-white"
                        >
                            <ArrowLeft className="size-5 text-gray-700" />
                        </Link>
                    </div>

                    {/* Content */}
                    <div className="relative -mt-6 z-10 flex flex-col gap-4 rounded-t-3xl border-t-2 border-[var(--menu-main)] bg-[var(--menu-back)] p-4 shadow-lg">
                        {/* بطاقة المنتج */}
                        <div className="rounded-md border border-black/10 bg-white p-4 shadow-md">
                            <h1 className="mb-3 text-2xl font-bold text-gray-800">{name}</h1>

                            {description && (
                                <p className="mb-4 text-justify text-base leading-relaxed text-gray-700">
                                    {description}
                                </p>
                            )}

                            {product.calories && (
                                <div className="mb-3 flex items-center gap-1 text-sm text-gray-500">
                                    <Flame className="size-4 text-orange-400" />
                                    {product.calories} {t('meal.calories')}
                                </div>
                            )}

                            <div className="mb-4 text-2xl font-bold text-[var(--menu-main)]">
                                {price.toFixed(2)}
                            </div>

                            {qty === 0 ? (
                                <button
                                    onClick={handleAdd}
                                    className="w-full rounded-lg py-3 font-bold text-white transition hover:brightness-95"
                                    style={{ backgroundColor: 'var(--menu-main)' }}
                                >
                                    + {t('common.add')}
                                </button>
                            ) : (
                                <div className="flex items-center justify-center gap-6 rounded-lg border bg-gray-100 py-2">
                                    <button onClick={() => decreaseQty(product.id)} className="text-xl font-bold px-4 hover:text-[var(--menu-main)]">−</button>
                                    <span className="text-xl font-bold">{qty}</span>
                                    <button onClick={() => increaseQty(product.id)} className="text-xl font-bold px-4 hover:text-[var(--menu-main)]">+</button>
                                </div>
                            )}
                        </div>

                        {/* منتجات مشابهة */}
                        {relatedProducts.length > 0 && (
                            <section>
                                <h2 className="mb-3 text-xl font-semibold text-[var(--menu-main)]">
                                    {t('otherProducts', 'منتجات أخرى')}
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {relatedProducts.map((p) => (
                                        <div key={p.id} className="flex flex-[0_0_calc(50%-0.375rem)]">
                                            <MealCard product={p} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        <footer className="pb-16 pt-6 text-center text-xs uppercase tracking-wide text-gray-400">
                            © {new Date().getFullYear()} All rights reserved
                        </footer>
                    </div>

                    <CartSummary onOpen={() => setCartOpen(true)} />
                    <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
                </div>
            </div>
        </>
    );
}
