
"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp } from "../actions";

const initialState = {
  error: "",
  success: false,
};

export default function SignUpForm() {
  const [state, formAction, pending] =
    useActionState(signUp, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-semibold">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          minLength={2}
          maxLength={80}
          required
          className="block w-full rounded-lg border border-gray-300 px-4 py-3"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-semibold">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="block w-full rounded-lg border border-gray-300 px-4 py-3"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-semibold">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className="block w-full rounded-lg border border-gray-300 px-4 py-3"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
      >
        {pending ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center text-sm text-gray-600">
        <Link href="/signin" className="text-orange-600 hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
