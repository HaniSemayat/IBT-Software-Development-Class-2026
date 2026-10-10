"use client";

import { useActionState } from "react";
import { signIn } from "../actions";

const initialState = {
  error: "",
  success: false,
};

export default function SignInForm({ next }) {
  const [state, formAction, pending] =
    useActionState(signIn, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="next" value={next} />

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
          htmlFor="email"
          className="mb-2 block text-sm font-semibold text-gray-800"
        >
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          placeholder="addistesfa@gmail.com"
          required
          className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-semibold text-gray-800"
        >
          Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          placeholder="123456"
          required
          className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
