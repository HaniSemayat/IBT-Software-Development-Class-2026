"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext(null);
const FavoritesContext = createContext(null);

export function useCart() {
  return useContext(CartContext);
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used inside Providers");
  return context;
}

export default function Providers({ children }) {
  const [items, setItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [favoritesReady, setFavoritesReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("addiseats-favorites");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setFavorites(parsed);
      }
    } catch {
      localStorage.removeItem("addiseats-favorites");
    } finally {
      setFavoritesReady(true);
    }
  }, []);

  useEffect(() => {
    if (!favoritesReady) return;
    localStorage.setItem("addiseats-favorites", JSON.stringify(favorites));
  }, [favorites, favoritesReady]);

  const addToCart = useCallback((dish) => {
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
  }, []);

  const increaseQuantity = useCallback((id) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  const decreaseQuantity = useCallback((id) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const toggleFavorite = useCallback((dish) => {
    setFavorites((current) =>
      current.some((item) => item.id === dish.id)
        ? current.filter((item) => item.id !== dish.id)
        : [...current, dish]
    );
  }, []);

  const isFavorite = useCallback(
    (id) => favorites.some((item) => item.id === id),
    [favorites]
  );

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, addToCart, increaseQuantity, decreaseQuantity, total, clearCart }}
    >
      <FavoritesContext.Provider
        value={{ favorites, toggleFavorite, isFavorite, favoritesReady }}
      >
        {children}
      </FavoritesContext.Provider>
    </CartContext.Provider>
  );
}
