"use client";

import { useActionState } from "react";
import Link from "next/link";

import { placeOrder } from "../actions";

const initialState = {
  error: "",
  fieldErrors: {},
  success: false,
};

export default function CheckoutForm() {
  const [state, formAction, pending] =
    useActionState(placeOrder, initialState);

  if (state.success) {
    return (
      <section className="mt-4">
        <p role="alert">
          Your order has been placed successfully!
        </p>

        <Link
          href="/menu"
          className="mt-4 inline-block border px-3 py-1"
        >
          Order more food
        </Link>
      </section>
    );
  }

  return (
    <form action={formAction} className="mt-4 max-w-md space-y-4">
      {state.error && (
        <p role="alert" className="border p-2">
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="name">Name</label>

        <input
          id="name"
          name="name"
          type="text"
          className="block w-full border p-2"
        />

        {state.fieldErrors?.name && (
          <p role="alert">{state.fieldErrors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone">TeleBirr Phone</label>

        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="09XXXXXXXX"
          className="block w-full border p-2"
        />

        {state.fieldErrors?.phone && (
          <p role="alert">{state.fieldErrors.phone}</p>
        )}
      </div>

      <div>
        <label htmlFor="area">Delivery Area</label>

        <input
          id="area"
          name="area"
          type="text"
          defaultValue="Bole"
          className="block w-full border p-2"
        />

        {state.fieldErrors?.area && (
          <p role="alert">{state.fieldErrors.area}</p>
        )}
      </div>

      <div>
        <label htmlFor="notes">Notes (optional)</label>

        <textarea
          id="notes"
          name="notes"
          placeholder="Any delivery instructions?"
          className="block w-full border p-2"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="border px-4 py-2"
      >
        {pending ? "Placing order..." : "Place Order"}
      </button>
    </form>
  );
}