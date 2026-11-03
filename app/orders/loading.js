export default function OrdersLoading() {
  return (
    <main
      className="mx-auto max-w-6xl px-6 py-12"
      aria-busy="true"
      aria-label="Loading your orders"
    >
      <div className="h-9 w-56 animate-pulse rounded-lg bg-brand/10" />
      <div className="mt-3 h-5 w-80 max-w-full animate-pulse rounded-lg bg-border" />

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="grid grid-cols-4 gap-4 border-b border-border bg-background p-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-5 animate-pulse rounded bg-border" />
          ))}
        </div>
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 border-b border-border p-4 last:border-b-0">
            {Array.from({ length: 4 }, (_, cell) => (
              <div key={cell} className="h-5 animate-pulse rounded bg-background" />
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
