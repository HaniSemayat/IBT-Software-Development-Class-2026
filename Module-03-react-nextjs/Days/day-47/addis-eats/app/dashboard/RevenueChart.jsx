"use client";

import { formatETB } from "../../lib/format";

export default function RevenueChart({ data = [] }) {
  const max = Math.max(...data.map((item) => Number(item.total) || 0), 1);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-950">Revenue by neighbourhood</h2>
          <p className="mt-1 text-sm text-gray-500">Order value excluding cancellations</p>
        </div>
        <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">ETB</span>
      </div>

      {data.length === 0 ? (
        <div className="mt-8 rounded-xl bg-gray-50 px-4 py-10 text-center">
          <p className="font-semibold text-gray-700">No revenue data yet</p>
          <p className="mt-1 text-sm text-gray-500">Revenue will appear here when orders are placed.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {data.map((item) => {
            const amount = Math.max(0, Number(item.total) || 0);
            const width = amount === 0 ? 0 : Math.max(3, (amount / max) * 100);

            return (
              <div key={item.area}>
                <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                  <span className="font-semibold text-gray-700">{item.area}</span>
                  <span className="font-bold tabular-nums text-gray-950">{formatETB(amount)}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-violet-600 transition-all duration-500"
                    style={{ width: `${width}%` }}
                    role="img"
                    aria-label={`${item.area}: ${formatETB(amount)}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
