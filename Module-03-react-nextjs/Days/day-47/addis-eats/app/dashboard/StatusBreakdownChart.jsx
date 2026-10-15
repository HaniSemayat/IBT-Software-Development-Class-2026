"use client";

const colors = {
  placed: "bg-blue-500",
  preparing: "bg-amber-500",
  ready: "bg-emerald-500",
  out_for_delivery: "bg-violet-600",
  delivered: "bg-green-600",
  cancelled: "bg-red-500",
};

export default function StatusBreakdownChart({ data = [] }) {
  const total = data.reduce((sum, item) => sum + (Number(item.count) || 0), 0);
  const max = Math.max(...data.map((item) => Number(item.count) || 0), 1);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-950">Order status breakdown</h2>
          <p className="mt-1 text-sm text-gray-500">Current orders grouped by status</p>
        </div>
        <p className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-700">{total} total orders</p>
      </div>

      <div className="mt-7 grid gap-x-10 gap-y-6 md:grid-cols-2">
        {data.map((item) => {
          const count = Number(item.count) || 0;
          const width = count === 0 ? 0 : Math.max(4, (count / max) * 100);

          return (
            <div key={item.status}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <span className="text-sm font-bold tabular-nums text-gray-950">{count}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full ${colors[item.status] || "bg-violet-600"}`}
                  style={{ width: `${width}%` }}
                  role="img"
                  aria-label={`${item.label}: ${count} orders`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
