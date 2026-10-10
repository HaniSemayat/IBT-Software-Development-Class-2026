"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

const CartContext = createContext(null);

export function useCart() {
  return useContext(CartContext);
}

export default function Providers({ children }) {
  const [items, setItems] = useState([]);

  function addToCart(dish) {
    setItems((currentItems) => {
      const existing = currentItems.find((item) => item.id === dish.id);

      if (existing) {
        return currentItems.map((item) =>
          item.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentItems, { ...dish, quantity: 1 }];
    });
  }

  function increaseQuantity(id) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  function decreaseQuantity(id) {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        total,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}