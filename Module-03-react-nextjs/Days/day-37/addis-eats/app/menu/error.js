"use client";

import Link from "next/link";

export default function MenuError({ reset }) {
  return (
    <main>
      <h1>Something went wrong</h1>
      <p>We could not load the menu.</p>

      <button onClick={() => reset()}>
        Try Again
      </button>

      <br />

      <Link href="/">Back Home</Link>
    </main>
  );
}