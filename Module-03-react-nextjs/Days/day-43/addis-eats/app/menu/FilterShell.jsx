"use client";

import { useState } from "react";

export default function FilterShell({ children }) {
  const [showDishes, setShowDishes] = useState(true);

  return (
    <div>
      <button
        onClick={() => setShowDishes(!showDishes)}
        className="mb-4 border px-3 py-1"
      >
        {showDishes ? "Hide Dishes" : "Show Dishes"}
      </button>

      {showDishes && children}
    </div>
  );
}