export default function OrdersLoading() {
  return (
    <main
      className="mx-auto max-w-6xl px-6 py-12"
      aria-busy="true"
      aria-label="Loading your orders"
    >
      <div className="h-9 w-56 animate-pulse rounded bg-gray-200" />
      <div className="mt-3 h-5 w-80 max-w-full animate-pulse rounded bg-gray-200" />

      <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="grid grid-cols-4 gap-4 border-b bg-gray-50 p-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-5 animate-pulse rounded bg-gray-200" />
          ))}
        </div>
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 border-b p-4">
            {Array.from({ length: 4 }, (_, cell) => (
              <div key={cell} className="h-5 animate-pulse rounded bg-gray-100" />
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}

