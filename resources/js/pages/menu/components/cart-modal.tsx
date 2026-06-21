import { X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCartStore } from '@/stores/cart-store';

type Props = {
    open: boolean;
    onClose: () => void;
    restaurantName?: string;
    phone?: string;
    deliveryFee?: number;
};

type Step = 'items' | 'method' | 'details';
type Method = 'address' | 'table';

export function CartModal({ open, onClose, restaurantName = '', phone = '', deliveryFee = 0 }: Props) {
    const { t } = useTranslation();
    const { items, increaseQty, decreaseQty, removeItem, totalPrice, clearCart } = useCartStore();

    const [step, setStep]     = useState<Step>('items');
    const [method, setMethod] = useState<Method>('table');
    const [name, setName]     = useState('');
    const [address, setAddress] = useState('');
    const [tableNumber, setTableNumber] = useState('');
    const [notes, setNotes]   = useState('');

    const subTotal    = totalPrice();
    const delivery    = method === 'address' ? deliveryFee : 0;
    const grandTotal  = subTotal + delivery;

    function handleConfirm() {
        const itemsList = items
            .map((i) => `• ${i.name} × ${i.quantity} = ${(i.price * i.quantity).toFixed(2)}`)
            .join('\n');

        const locationLine = method === 'address'
            ? `📍 ${t('cart.address')}: ${address}`
            : `🪑 ${t('cart.option.table')}: ${tableNumber}`;

        const message = [
            `🍽️ *${restaurantName}*`,
            `👤 ${name}`,
            locationLine,
            `\n${itemsList}`,
            `\n💰 ${t('cart.total')}: ${subTotal.toFixed(2)}`,
            delivery > 0 ? `🚚 ${t('cart.deliveryFee')}: ${delivery.toFixed(2)}` : null,
            `✅ *${t('cart.grandTotal')}: ${grandTotal.toFixed(2)}*`,
            notes ? `📝 ${t('form.notes')}: ${notes}` : null,
        ]
            .filter(Boolean)
            .join('\n');

        const cleanPhone = phone.replace(/\s+/g, '');
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');

        clearCart();
        setStep('items');
        setName('');
        setAddress('');
        setTableNumber('');
        setNotes('');
        onClose();
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-zinc-100">
            {/* Header */}
            <div className="flex items-center justify-between border-b bg-white px-4 py-3">
                <h2 className="text-lg font-bold text-gray-800">
                    {step === 'items'   && t('cart.title')}
                    {step === 'method'  && t('cart.howReceive')}
                    {step === 'details' && t('form.fillForm')}
                </h2>
                <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
                    <X className="size-5" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {/* Step 1 — Items */}
                {step === 'items' && (
                    <div className="space-y-3">
                        {items.length === 0 ? (
                            <p className="py-8 text-center text-gray-400">{t('cart.empty', 'Your cart is empty')}</p>
                        ) : (
                            items.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
                                    {item.image && (
                                        <img src={`/storage/${item.image}`} alt={item.name} className="h-16 w-16 rounded object-cover" />
                                    )}
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800">{item.name}</p>
                                        <p className="text-sm text-[var(--menu-main)]">
                                            {(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 rounded-md border bg-gray-100">
                                        <button onClick={() => decreaseQty(item.id)} className="px-2 py-1 text-sm font-bold hover:bg-gray-200">−</button>
                                        <span className="min-w-[20px] text-center text-sm font-bold">{item.quantity}</span>
                                        <button onClick={() => increaseQty(item.id)} className="px-2 py-1 text-sm font-bold hover:bg-gray-200">+</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Step 2 — Method */}
                {step === 'method' && (
                    <div className="grid grid-cols-2 gap-3">
                        {(['address', 'table'] as Method[]).map((m) => (
                            <button
                                key={m}
                                onClick={() => setMethod(m)}
                                className={[
                                    'rounded-lg border-2 p-4 text-center font-semibold transition',
                                    method === m
                                        ? 'border-[var(--menu-main)] bg-[var(--menu-main)] text-white'
                                        : 'border-gray-200 bg-white text-gray-700',
                                ].join(' ')}
                            >
                                {m === 'address' ? t('cart.option.address') : t('cart.option.table')}
                            </button>
                        ))}
                        {method === 'table' && (
                            <input
                                value={tableNumber}
                                onChange={(e) => setTableNumber(e.target.value)}
                                placeholder={t('cart.option.table')}
                                className="col-span-2 mt-2 rounded-md border px-3 py-2 text-sm"
                            />
                        )}
                    </div>
                )}

                {/* Step 3 — Details */}
                {step === 'details' && (
                    <div className="space-y-3">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={`${t('cart.name')} *`}
                            className="w-full rounded-md border px-3 py-2 text-sm"
                        />
                        {method === 'address' && (
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder={t('cart.address')}
                                rows={3}
                                className="w-full rounded-md border px-3 py-2 text-sm"
                            />
                        )}
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder={t('form.notes')}
                            rows={2}
                            className="w-full rounded-md border px-3 py-2 text-sm"
                        />
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="border-t bg-white p-4">
                <div className="mb-3 flex items-center justify-between text-sm text-gray-600">
                    <span>{t('cart.total')}</span>
                    <span className="font-bold text-gray-800">{subTotal.toFixed(2)}</span>
                </div>
                {delivery > 0 && (
                    <div className="mb-3 flex items-center justify-between text-sm text-gray-600">
                        <span>{t('cart.deliveryFee')}</span>
                        <span>{delivery.toFixed(2)}</span>
                    </div>
                )}
                <div className="mb-4 flex items-center justify-between font-bold text-gray-800">
                    <span>{t('cart.grandTotal')}</span>
                    <span className="text-[var(--menu-main)]">{grandTotal.toFixed(2)}</span>
                </div>

                <div className="flex flex-col gap-2">
                    {step === 'items' && (
                        <>
                            <button
                                onClick={() => items.length > 0 && setStep('method')}
                                disabled={items.length === 0}
                                className="w-full rounded-lg py-3 font-bold text-white transition disabled:opacity-50"
                                style={{ backgroundColor: 'var(--menu-main)' }}
                            >
                                {t('cart.checkout')}
                            </button>
                            <button onClick={onClose} className="w-full rounded-lg border py-2 text-sm text-gray-600 hover:bg-gray-50">
                                {t('cart.browseMeals')}
                            </button>
                        </>
                    )}
                    {step === 'method' && (
                        <>
                            <button
                                onClick={() => setStep('details')}
                                className="w-full rounded-lg py-3 font-bold text-white"
                                style={{ backgroundColor: 'var(--menu-main)' }}
                            >
                                {t('cart.checkout')}
                            </button>
                            <button onClick={() => setStep('items')} className="w-full rounded-lg border py-2 text-sm text-gray-600 hover:bg-gray-50">
                                {t('common.cancel')}
                            </button>
                        </>
                    )}
                    {step === 'details' && (
                        <>
                            <button
                                onClick={handleConfirm}
                                disabled={!name.trim()}
                                className="w-full rounded-lg bg-green-600 py-3 font-bold text-white transition hover:bg-green-700 disabled:opacity-50"
                            >
                                {t('cart.confirmSend')}
                            </button>
                            <button onClick={() => setStep('method')} className="w-full rounded-lg border py-2 text-sm text-gray-600 hover:bg-gray-50">
                                {t('common.cancel')}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
