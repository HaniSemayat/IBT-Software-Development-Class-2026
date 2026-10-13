"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-ET", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));

export default function OrdersLineChart({ data }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold text-gray-950">Orders over time</h2>
      <p className="mt-1 text-sm text-gray-600">
        Number of orders per day · Dates shown in UTC
      </p>

      <div className="mt-5 h-72 w-full" role="img" aria-label="Line chart of daily order counts. The same figures are available in the table below.">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
            />
            <YAxis allowDecimals={false} width={40} tick={{ fontSize: 12 }} />
            <Tooltip
              labelFormatter={(label) => `Date: ${formatDate(String(label))}`}
              formatter={(value) => [Number(value), "Orders"]}
            />
            <Line
              type="monotone"
              dataKey="orders"
              name="Orders"
              stroke="#6b4eff"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="mb-3 text-left font-semibold text-gray-800">
            Daily order counts (UTC)
          </caption>
          <thead>
            <tr className="border-b border-gray-300">
              <th scope="col" className="py-3 pr-4 font-semibold">Date</th>
              <th scope="col" className="py-3 text-right font-semibold">Orders</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.date} className="border-b border-gray-100">
                <th scope="row" className="py-3 pr-4 font-medium text-gray-800">
                  {formatDate(item.date)}
                </th>
                <td className="py-3 text-right tabular-nums text-gray-800">
                  {item.orders}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
