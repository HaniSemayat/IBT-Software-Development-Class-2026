"use client";

import { useActionState, useState } from "react";
import { signIn } from "../actions";

const initialState = {
  error: "",
  success: false,
};

const inputClass =
  "block min-h-12 w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

const demoAccounts = [
  {
    label: "Use Customer Demo",
    email: "customer@addiseats.com",
    password: "123456",
  },
  {
    label: "Use Admin Demo",
    email: "adminone@addiseats.com",
    password: "123456",
  },
];

export default function SignInForm({ next }) {
  const [state, formAction, pending] =
    useActionState(signIn, initialState);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function useDemoAccount(account) {
    setEmail(account.email);
    setPassword(account.password);
  }

  return (
    <div>
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
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
            value={password}
            onChange={(event) => setPassword(event.target.value)}
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

      <div className="mt-6 border-t border-border pt-5">
        <p className="mb-3 text-center text-sm font-semibold text-foreground">
          Just exploring? Try a demo account
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {demoAccounts.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() => useDemoAccount(account)}
              className="min-h-11 cursor-pointer rounded-xl border border-border px-3 py-2 text-sm font-semibold text-brand transition-colors hover:border-brand hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {account.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
