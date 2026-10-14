"use client";

export default function CategoryBar({ categories, selectedCategory, onSelect }) {
  return (
    <nav aria-label="Filter dishes by category" className="mb-5 flex flex-wrap gap-2">
      {categories.map((category) => {
        const selected = selectedCategory === category;
        return (
          <button
            key={category}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(category)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              selected
                ? "border-orange-600 bg-orange-600 text-white shadow-sm"
                : "border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:text-orange-700"
            }`}
          >
            {category}
          </button>
        );
      })}
    </nav>
  );
}
