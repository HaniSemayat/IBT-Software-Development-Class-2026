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
      <section className="text-center">
        <div className="rounded-xl bg-green-50 p-6">
          <h2 className="text-2xl font-bold text-green-800">
            Order placed successfully!
          </h2>

          <p className="mt-2 text-green-700">
            Thank you for ordering from Addis Eats.
          </p>
        </div>

        <Link
          href="/menu"
          className="mt-6 inline-block rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700"
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

      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-semibold text-gray-800"
        >
          Name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        />

        {state.fieldErrors?.name && (
          <p role="alert" className="mt-2 text-sm text-red-600">
            {state.fieldErrors.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="mb-2 block text-sm font-semibold text-gray-800"
        >
          TeleBirr Phone
        </label>

        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="09XXXXXXXX"
          className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        />

        {state.fieldErrors?.phone && (
          <p role="alert" className="mt-2 text-sm text-red-600">
            {state.fieldErrors.phone}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="area"
          className="mb-2 block text-sm font-semibold text-gray-800"
        >
          Delivery Area
        </label>

        <input
          id="area"
          name="area"
          type="text"
          defaultValue="Bole"
          className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        />

        {state.fieldErrors?.area && (
          <p role="alert" className="mt-2 text-sm text-red-600">
            {state.fieldErrors.area}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="notes"
          className="mb-2 block text-sm font-semibold text-gray-800"
        >
          Notes <span className="font-normal text-gray-500">(optional)</span>
        </label>

        <textarea
          id="notes"
          name="notes"
          rows="4"
          placeholder="Any delivery instructions?"
          className="block w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Placing Order..." : "Place Order"}
      </button>
    </form>
  );
}