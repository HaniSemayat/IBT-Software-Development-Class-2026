"use client";

import { useState } from "react";

export default function MenuCounter() {
  const [count, setCount] = useState(0);

  return (
    <div className="mt-8 border-t pt-4">
      <p>Menu counter: {count}</p>

      <button
        onClick={() => setCount(count + 1)}
        className="mt-2 border px-3 py-1"
      >
        +1
      </button>
    </div>
  );
}
