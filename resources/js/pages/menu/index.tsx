import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import i18n from '@/i18n';
import { useContentTranslations } from '@/hooks/use-content-translations';
import { CartModal } from './components/cart-modal';
import { CartSummary } from './components/cart-summary';
import { HeroSection } from './components/hero-section';
import { MealCard } from './components/meal-card';
import type { Category, HomePageProps, Locale } from './types';

// ─── Category Tabs ────────────────────────────────────────────────────────────

function CategoryTabs({
    categories,
    active,
    onSelect,
}: {
    categories: Category[];
    active: number | null;
    onSelect: (id: number | null) => void;
}) {
    const { t, i18n } = useTranslation();
    const { getName } = useContentTranslations();

    return (
        <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 pt-1">
            <button
                onClick={() => onSelect(null)}
                className={[
                    'flex-shrink-0 rounded-full border-2 px-3 py-1 text-sm font-medium transition',
                    active === null
                        ? 'border-transparent bg-[var(--menu-main)] text-white'
                        : 'border-gray-200 text-black hover:bg-gray-100',
                ].join(' ')}
            >
                {t('all', 'الكل')}
            </button>
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onSelect(cat.id)}
                    className={[
                        'flex-shrink-0 rounded-full border-2 px-3 py-1 text-sm font-medium transition',
                        active === cat.id
                            ? 'border-transparent bg-[var(--menu-main)] text-white'
                            : 'border-gray-200 text-black hover:bg-gray-100',
                    ].join(' ')}
                >
                    {getName(cat, i18n.language)}
                </button>
            ))}
        </div>
    );
}

// ─── Meals Grid ───────────────────────────────────────────────────────────────

function MealsGrid({ category }: { category: Category }) {
    const { i18n } = useTranslation();
    const { getName } = useContentTranslations();

    return (
        <section id={`category-${category.id}`} data-category-id={category.id}>
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
                {getName(category, i18n.language)}
            </h3>
            <div className="flex flex-wrap gap-3">
                {category.products.map((product) => (
                    <div key={product.id} className="flex flex-[0_0_calc(50%-0.375rem)]">
                        <MealCard product={product} />
                    </div>
                ))}
            </div>
        </section>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MenuHome({ categories, popularMeals, sliders, enabledLocales }: HomePageProps) {
    const { t } = useTranslation();
    const [activeCategory, setActiveCategory] = useState<number | null>(null);
    const [cartOpen, setCartOpen] = useState(false);
    const sectionRefs = useRef<Record<number, HTMLElement | null>>({});

    // مزامنة لغة i18n مع enabledLocales
    useEffect(() => {
        const defaultLocale = enabledLocales.find((l) => l.is_default);
        if (defaultLocale && i18n.language !== defaultLocale.code) {
            void i18n.changeLanguage(defaultLocale.code);
        }
        applyDir(enabledLocales, i18n.language);
    }, []);

    function handleSwitchLocale(code: string) {
        void i18n.changeLanguage(code);
        applyDir(enabledLocales, code);
        // مزامنة مع السيرفر
        window.location.href = `/locale/${code}`;
    }

    const visibleCategories = activeCategory === null
        ? categories.filter((c) => c.products.length > 0)
        : categories.filter((c) => c.id === activeCategory && c.products.length > 0);

    return (
        <>
            <Head title={t('nav.home', 'Menu')} />

            <div className="min-h-screen bg-zinc-100">
                <div className="relative mx-auto min-h-screen max-w-xl bg-white">
                    {/* Hero */}
                    <HeroSection
                        locales={enabledLocales}
                        onSwitchLocale={handleSwitchLocale}
                    />

                    {/* Content Panel */}
                    <div className="relative -mt-8 z-10 flex flex-col gap-4 rounded-t-3xl border-t-2 border-[var(--menu-main)] bg-[var(--menu-back)] p-4 shadow-lg">

                        {/* Popular Meals */}
                        {popularMeals.length > 0 && (
                            <section>
                                <h2 className="mb-3 text-xl font-semibold text-[var(--menu-main)]">
                                    {t('popularMeals.title', 'الوجبات الأكثر طلباً')}
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {popularMeals.map((product) => (
                                        <div key={product.id} className="flex flex-[0_0_calc(50%-0.375rem)]">
                                            <MealCard product={product} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Category Tabs — Sticky */}
                        {categories.length > 0 && (
                            <div className="sticky top-0 z-20 bg-[var(--menu-back)] -mx-4 px-4 py-2 shadow-sm">
                                <CategoryTabs
                                    categories={categories}
                                    active={activeCategory}
                                    onSelect={setActiveCategory}
                                />
                            </div>
                        )}

                        {/* Meals by Category */}
                        <div className="flex flex-col gap-8">
                            {visibleCategories.map((cat) => (
                                <MealsGrid key={cat.id} category={cat} />
                            ))}
                        </div>

                        {/* Footer */}
                        <footer className="pb-16 pt-6 text-center text-xs uppercase tracking-wide text-gray-400">
                            © {new Date().getFullYear()} All rights reserved
                        </footer>
                    </div>

                    {/* Cart */}
                    <CartSummary onOpen={() => setCartOpen(true)} />
                    <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
                </div>
            </div>
        </>
    );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function applyDir(locales: Locale[], code: string) {
    const locale = locales.find((l) => l.code === code);
    document.documentElement.dir  = locale?.dir ?? 'ltr';
    document.documentElement.lang = code;
}
