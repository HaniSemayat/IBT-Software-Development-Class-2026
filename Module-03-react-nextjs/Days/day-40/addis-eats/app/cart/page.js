"use client";

import { useState } from "react";
import Link from "next/link";

const initialItems = [
  { id: 1, name: "Doro Wot", price: 650, quantity: 1 },
  { id: 2, name: "Tibs", price: 500, quantity: 1 },
];

export default function CartPage() {
  const [items, setItems] = useState(initialItems);

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

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Your Cart</h1>

      {items.length === 0 ? (
        <p className="mt-4">Your cart is currently empty.</p>
      ) : (
        <div className="mt-4 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border p-4"
            >
              <div>
                <h2 className="font-bold">{item.name}</h2>
                <p>
                  {item.price} ETB × {item.quantity}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => decreaseQuantity(item.id)}
                  className="border px-3 py-1"
                >
                  -
                </button>

                <span className="px-2 py-1">{item.quantity}</span>

                <button
                  onClick={() => increaseQuantity(item.id)}
                  className="border px-3 py-1"
                >
                  +
                </button>
              </div>
            </div>
          ))}

          <div className="border-t pt-4">
            <p className="text-xl font-bold">
              Total: {total} ETB
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-4">
        <Link href="/menu">Continue Shopping</Link>
        <Link href="/checkout">Go to Checkout</Link>
      </div>
    </main>
  );
}