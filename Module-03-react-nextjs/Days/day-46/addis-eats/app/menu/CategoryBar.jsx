"use client";

import { useState } from "react";

export default function CategoryBar({ categories }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <nav className="mb-4 flex gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className="border px-3 py-1"
        >
          {category}
        </button>
      ))}

      <span className="ml-4">
        Selected: {selectedCategory}
      </span>
    </nav>
  );
}