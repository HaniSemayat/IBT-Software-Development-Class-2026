"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "../Providers";
import { placeOrder } from "../actions";

const initialState = {
  error: "",
  fieldErrors: {},
  success: false,
};

export default function CheckoutForm() {
  const { items, total, clearCart } = useCart();

  const [state, formAction, pending] =
    useActionState(placeOrder, initialState);

  useEffect(() => {
    if (state.success) {
      clearCart();
    }
  }, [state.success, clearCart]);

  if (state.success) {
    return (
      <section className="text-center">
        <div className="rounded-xl bg-green-50 p-6">
          <h2 className="text-2xl font-bold text-green-800">
            Order placed successfully!
          </h2>
          <p className="mt-2 text-green-700">
            Your order total was {state.order.total} ETB.
          </p>
        </div>

        <Link
          href="/menu"
          className="mt-6 inline-block rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white"
        >
          Order More Food
        </Link>
      </section>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {state.error}
        </p>
      )}

      {items.length === 0 ? (
        <p className="rounded-lg bg-orange-50 p-4 text-orange-800">
          Your cart is empty. Add dishes from the menu before checking out.
        </p>
      ) : (
        <section className="rounded-xl border p-4">
          <h2 className="font-bold">Order summary</h2>
          {items.map((item) => (
            <p key={item.id} className="mt-2 text-sm">
              {item.name} × {item.quantity}
            </p>
          ))}
          <p className="mt-3 font-bold">
            Estimated total: {total} ETB
          </p>
        </section>
      )}

      <input
        type="hidden"
        name="cartItems"
        value={JSON.stringify(
          items.map(({ id, quantity }) => ({ id, quantity }))
        )}
      />

      {[
        { name: "name", label: "Name", type: "text" },
        {
          name: "phone",
          label: "TeleBirr Phone",
          type: "tel",
          placeholder: "09XXXXXXXX",
        },
        {
          name: "area",
          label: "Delivery Area",
          type: "text",
          defaultValue: "Bole",
        },
      ].map((field) => (
        <div key={field.name}>
          <label
            htmlFor={field.name}
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            {field.label}
          </label>
          <input
            id={field.name}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            defaultValue={field.defaultValue}
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />
          {state.fieldErrors?.[field.name] && (
            <p role="alert" className="mt-2 text-sm text-red-600">
              {state.fieldErrors[field.name]}
            </p>
          )}
        </div>
      ))}

      <div>
        <label
          htmlFor="notes"
          className="mb-2 block text-sm font-semibold text-gray-800"
        >
          Notes (optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          placeholder="Any delivery instructions?"
          className="block w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        />
      </div>

      <button
        type="submit"
        disabled={pending || items.length === 0}
        className="w-full rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Placing Order..." : "Place Order"}
      </button>
    </form>
  );
}