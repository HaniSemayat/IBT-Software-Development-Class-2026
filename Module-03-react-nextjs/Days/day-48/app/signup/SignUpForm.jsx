"use client";

import { useActionState } from "react";
import { signUp } from "../actions";

const initialState = {
  error: "",
  success: false,
};

const inputClass =
  "block min-h-12 w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

export default function SignUpForm() {
  const [state, formAction, pending] =
    useActionState(signUp, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <p
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/5 p-4 text-sm text-danger"
        >
          {state.error}
        </p>
      )}

      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-semibold text-foreground"
        >
          Full Name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Enter your full name"
          minLength={2}
          maxLength={80}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-semibold text-foreground"
        >
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-semibold text-foreground"
        >
          Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          minLength={8}
          required
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-brand px-5 py-3 font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}
