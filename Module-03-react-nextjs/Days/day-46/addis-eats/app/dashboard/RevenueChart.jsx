"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const formatETB = (value) =>
  new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(value);

export default function RevenueChart({ data }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold text-gray-950">
        Revenue by neighbourhood
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        Net order value, excluding cancelled orders · Ethiopian birr (ETB)
      </p>

      <div className="mt-5 h-72 w-full" role="img" aria-label="Bar chart of revenue by neighbourhood. The same figures are available in the table below.">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 12, left: 12, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="area" tick={{ fontSize: 12 }} />
            <YAxis
              width={95}
              tickFormatter={(value) => formatETB(Number(value))}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              formatter={(value) => [formatETB(Number(value)), "Revenue"]}
              labelFormatter={(label) => `Neighbourhood: ${label}`}
            />
            <Bar dataKey="total" name="Revenue" fill="#6b4eff" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="mb-3 text-left font-semibold text-gray-800">
            Revenue by neighbourhood (ETB)
          </caption>
          <thead>
            <tr className="border-b border-gray-300">
              <th scope="col" className="py-3 pr-4 font-semibold">Neighbourhood</th>
              <th scope="col" className="py-3 text-right font-semibold">Revenue (ETB)</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={2} className="py-4 text-gray-600">
                  No completed revenue data yet.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.area} className="border-b border-gray-100">
                  <th scope="row" className="py-3 pr-4 font-medium text-gray-800">
                    {item.area}
                  </th>
                  <td className="py-3 text-right tabular-nums text-gray-800">
                    {formatETB(item.total)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
