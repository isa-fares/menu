import { ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useCartStore } from '@/stores/cart-store';

type Props = {
    onOpen: () => void;
};

export function CartSummary({ onOpen }: Props) {
    const { t } = useTranslation();
    const { items, totalItems, totalPrice } = useCartStore();

    if (items.length === 0) return null;

    return (
        <div className="fixed inset-x-0 bottom-4 z-[1000] mx-auto w-[calc(100%-1rem)] max-w-[530px]">
            <button
                onClick={onOpen}
                className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-white shadow-lg transition hover:brightness-95"
                style={{ backgroundColor: 'var(--menu-main)' }}
            >
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <ShoppingCart className="size-5" />
                        <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[var(--menu-main)]">
                            {totalItems()}
                        </span>
                    </div>
                    <span className="text-sm font-bold">{t('cartt.title')}</span>
                </div>
                <span className="text-base font-bold">{totalPrice().toFixed(2)}</span>
            </button>
        </div>
    );
}
