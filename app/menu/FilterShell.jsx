"use client";

import { useState } from "react";

export default function FilterShell({ children }) {
  const [showDishes, setShowDishes] = useState(true);

  return (
    <div>
      <button
        onClick={() => setShowDishes(!showDishes)}
        className="mb-4 min-h-11 rounded-lg border px-4 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
      >
        {showDishes ? "Hide Dishes" : "Show Dishes"}
      </button>

      {showDishes && children}
    </div>
  );
}