import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Types ───────────────────────────────────────────────────────────────────

export type CartItem = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string | null;
};

type CartStore = {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: number) => void;
    increaseQty: (id: number) => void;
    decreaseQty: (id: number) => void;
    clearCart: () => void;
    totalItems: () => number;
    totalPrice: () => number;
};

// ─── Store ───────────────────────────────────────────────────────────────────

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) => {
                set((state) => {
                    const existing = state.items.find((i) => i.id === item.id);
                    if (existing) {
                        return {
                            items: state.items.map((i) =>
                                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
                            ),
                        };
                    }
                    return { items: [...state.items, { ...item, quantity: 1 }] };
                });
            },

            removeItem: (id) => {
                set((state) => ({
                    items: state.items.filter((i) => i.id !== id),
                }));
            },

            increaseQty: (id) => {
                set((state) => ({
                    items: state.items.map((i) =>
                        i.id === id ? { ...i, quantity: i.quantity + 1 } : i,
                    ),
                }));
            },

            decreaseQty: (id) => {
                set((state) => ({
                    items: state.items
                        .map((i) =>
                            i.id === id ? { ...i, quantity: i.quantity - 1 } : i,
                        )
                        .filter((i) => i.quantity > 0),
                }));
            },

            clearCart: () => set({ items: [] }),

            totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

            totalPrice: () =>
                get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        }),
        { name: 'cart' },
    ),
);
