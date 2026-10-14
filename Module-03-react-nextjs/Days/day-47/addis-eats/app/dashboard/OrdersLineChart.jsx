"use client";

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-ET", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));

export default function OrdersLineChart({ data = [] }) {
  const max = Math.max(...data.map((item) => Number(item.orders) || 0), 1);
  const total = data.reduce((sum, item) => sum + (Number(item.orders) || 0), 0);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-950">Orders over time</h2>
          <p className="mt-1 text-sm text-gray-500">Daily order activity · Last 7 days</p>
        </div>
        <div className="rounded-xl bg-violet-50 px-3 py-2 text-right">
          <p className="text-xs font-medium text-violet-700">7-day total</p>
          <p className="text-xl font-bold text-violet-900">{total}</p>
        </div>
      </div>

      {data.length === 0 ? (
        <p className="mt-8 rounded-xl bg-gray-50 p-8 text-center text-sm text-gray-500">No daily activity yet.</p>
      ) : (
        <div className="mt-8 grid grid-cols-7 gap-2 sm:gap-4" role="img" aria-label={`Daily orders over seven days. Total: ${total}.`}>
          {data.map((item) => {
            const count = Number(item.orders) || 0;
            const height = count === 0 ? 3 : Math.max(12, (count / max) * 100);

            return (
              <div key={item.date} className="flex min-w-0 flex-col items-center">
                <span className="mb-2 text-xs font-bold tabular-nums text-gray-700">{count}</span>
                <div className="flex h-40 w-full items-end justify-center rounded-t-lg bg-gray-50 px-1">
                  <div
                    className="w-full max-w-10 rounded-t-md bg-violet-600 transition-all duration-500"
                    style={{ height: `${height}%`, minHeight: "4px" }}
                    title={`${formatDate(item.date)}: ${count} orders`}
                  />
                </div>
                <span className="mt-3 text-center text-[10px] text-gray-500 sm:text-xs">{formatDate(item.date)}</span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
