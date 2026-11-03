"use client";

import { useActionState } from "react";
import { signIn } from "../actions";

const initialState = {
  error: "",
  success: false,
};

const inputClass =
  "block min-h-12 w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

export default function SignInForm({ next }) {
  const [state, formAction, pending] =
    useActionState(signIn, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="next" value={next} />

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
          htmlFor="email"
          className="mb-2 block text-sm font-semibold text-foreground"
        >
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
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
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-brand px-5 py-3 font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
