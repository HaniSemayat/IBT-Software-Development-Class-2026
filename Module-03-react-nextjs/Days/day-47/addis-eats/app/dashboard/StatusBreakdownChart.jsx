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

export default function StatusBreakdownChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <section
      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      aria-labelledby="status-breakdown-title"
    >
      <h2
        id="status-breakdown-title"
        className="text-xl font-bold text-gray-950"
      >
        Order status breakdown
      </h2>

      <p className="mt-1 text-sm text-gray-600">
        Current order counts by status · {total} total orders
      </p>

      <div
        className="mt-5 h-80 w-full"
        role="img"
        aria-label="Horizontal bar chart showing the number of orders in each status. Exact counts are available in the table below."
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="label"
              width={125}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              formatter={(value) => [Number(value), "Orders"]}
              labelFormatter={(label) => `Status: ${label}`}
            />
            <Bar
              dataKey="count"
              name="Orders"
              fill="#6b4eff"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="mb-3 text-left font-semibold text-gray-800">
            Orders by status
          </caption>
          <thead>
            <tr className="border-b border-gray-300">
              <th scope="col" className="py-3 pr-4 font-semibold">
                Status
              </th>
              <th scope="col" className="py-3 text-right font-semibold">
                Orders
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.status} className="border-b border-gray-100">
                <th
                  scope="row"
                  className="py-3 pr-4 font-medium text-gray-800"
                >
                  {item.label}
                </th>
                <td className="py-3 text-right tabular-nums text-gray-800">
                  {item.count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
