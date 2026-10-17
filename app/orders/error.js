"use client";

export default function OrdersError({ reset }) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12" role="alert">
      <h1 className="text-2xl font-bold text-gray-950">
        We couldn’t load your orders
      </h1>
      <p className="mt-3 text-gray-700">
        Your order history could not be retrieved. Please try again.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-5 rounded-lg bg-violet-700 px-4 py-2 font-semibold text-white hover:bg-violet-800"
      >
        Retry
      </button>
    </main>
  );
}
