"use client";

export default function CategoryBar({
  categories,
  selectedCategory,
  onSelect,
}) {
  return (
    <nav
      aria-label="Filter dishes by category"
      className="mb-6 overflow-x-auto overscroll-x-contain pb-2"
    >
      <div className="flex w-max min-w-full flex-nowrap gap-2">
        {categories.map((category) => {
          const selected = selectedCategory === category;

          return (
            <button
              key={category}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(category)}
              className={`inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                selected
                  ? "border-brand bg-brand text-white"
                  : "border-border bg-surface text-muted hover:border-brand/40 hover:bg-brand-soft hover:text-brand"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </nav>
  );
}