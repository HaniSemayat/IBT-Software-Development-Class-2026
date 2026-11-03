"use client";

import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "../Providers";
import { placeOrder } from "../actions";

const initialState = {
  error: "",
  fieldErrors: {},
  success: false,
};

const fields = [
  { name: "name", label: "Full Name", type: "text", autoComplete: "name" },
  {
    name: "phone",
    label: "TeleBirr Phone",
    type: "tel",
    placeholder: "09XXXXXXXX",
    autoComplete: "tel",
    inputMode: "tel",
  },
  {
    name: "area",
    label: "Delivery Area",
    type: "text",
    defaultValue: "Bole",
    autoComplete: "address-level2",
  },
];

const fieldClass =
  "block min-h-12 w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand aria-[invalid=true]:border-danger";

export default function CheckoutForm() {
  const { items, total, clearCart } = useCart();

  const [state, formAction, pending] = useActionState(
    placeOrder,
    initialState
  );
  const submissionIdRef = useRef(null);

  function handleSubmit(event) {
    if (!submissionIdRef.current) {
      submissionIdRef.current = crypto.randomUUID();
    }

    event.currentTarget.elements.submissionId.value =
      submissionIdRef.current;
  }

  useEffect(() => {
    if (state.success) {
      clearCart();
    }
  }, [state.success, clearCart]);

  if (state.success) {
    return (
      <section className="py-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-3xl">
          ✓
        </div>

        <h2 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
          Order placed successfully!
        </h2>

        <p className="mt-3 leading-7 text-muted">
          Your order total was{" "}
          <span className="font-bold text-foreground">
            {state.order.total} ETB
          </span>
          .
        </p>

        <p className="mt-2 text-sm text-muted">
          Thank you for choosing Addis Eats.
        </p>

        <Link
          href="/menu"
          className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Order More Food
        </Link>
      </section>
    );
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} className="space-y-7">
      <div>
        <h2 className="text-xl font-bold text-foreground">
          Delivery Details
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Tell us where to deliver your order.
        </p>
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/5 p-4 text-sm leading-6 text-danger"
        >
          {state.error}
        </p>
      )}

      {items.length === 0 ? (
        <section className="rounded-2xl border border-border bg-background p-5">
          <h3 className="font-bold text-foreground">Your cart is empty</h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            Add dishes from our menu before proceeding to checkout.
          </p>
          <Link
            href="/menu"
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-5 py-3 font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Browse Menu
          </Link>
        </section>
      ) : (
        <section className="rounded-2xl border border-border bg-background p-5 sm:p-6">
          <h3 className="font-bold text-foreground">Order Summary</h3>

          <ul className="mt-4 divide-y divide-border">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="mt-1 text-sm text-muted">
                    {item.price} ETB × {item.quantity}
                  </p>
                </div>

                <p className="shrink-0 font-semibold tabular-nums text-foreground">
                  {item.price * item.quantity} ETB
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-center justify-between gap-4 border-t border-border pt-5">
            <span className="font-semibold text-foreground">Estimated Total</span>
            <span className="text-xl font-bold tabular-nums text-brand">
              {total} ETB
            </span>
          </div>
        </section>
      )}

      <div className="space-y-5">
        {fields.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className="mb-2 block text-sm font-semibold text-foreground"
            >
              {field.label}
              <span className="ml-1 text-danger" aria-hidden="true">
                *
              </span>
            </label>

            <input
              id={field.name}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              inputMode={field.inputMode}
              placeholder={field.placeholder}
              defaultValue={field.defaultValue}
              required
              aria-invalid={Boolean(state.fieldErrors?.[field.name])}
              aria-describedby={
                state.fieldErrors?.[field.name]
                  ? `${field.name}-error`
                  : undefined
              }
              className={fieldClass}
            />

            {state.fieldErrors?.[field.name] && (
              <p
                id={`${field.name}-error`}
                role="alert"
                className="mt-2 text-sm text-danger"
              >
                {state.fieldErrors[field.name]}
              </p>
            )}
          </div>
        ))}

        <div>
          <label
            htmlFor="notes"
            className="mb-2 block text-sm font-semibold text-foreground"
          >
            Delivery Notes{" "}
            <span className="font-normal text-muted">(optional)</span>
          </label>

          <textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder="Landmarks, directions, or other delivery instructions..."
            className={`${fieldClass} resize-y`}
          />
        </div>
      </div>

      <input
        type="hidden"
        name="submissionId"
        ref={(element) => {
          if (element && submissionIdRef.current) {
            element.value = submissionIdRef.current;
          }
        }}
        defaultValue=""
      />

      <input
        type="hidden"
        name="cartItems"
        value={JSON.stringify(
          items.map(({ id, quantity }) => ({ id, quantity }))
        )}
      />

      <div className="border-t border-border pt-6">
        <button
          type="submit"
          disabled={pending || items.length === 0}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Placing Order..." : "Place Order"}
        </button>

        <p className="mt-3 text-center text-xs leading-5 text-muted">
          Please verify your phone number and delivery details before placing
          your order.
        </p>
      </div>
    </form>
  );
}