import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
    persist(
        (set) => ({
            items: [],

            addItem: (dish) =>
                set((state) => ({
                    items: [...state.items, dish]
                })),

            remove: (index) =>
                set((state) => ({
                    items: state.items.filter(
                        (_, itemIndex) => itemIndex !== index
                    )
                })),

            clear: () =>
                set({ items: [] })
        }),
        {
            name: "addis-eats-cart"
        }
    )
);