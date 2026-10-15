import Link from "next/link";
import { formatETB } from "../../lib/format";

const columns = [
  { key: "id", label: "Order" },
  { key: "area", label: "Neighbourhood" },
  { key: "status", label: "Status" },
  { key: "total", label: "Total (ETB)" },
];

const statusStyles = {
  placed: "bg-blue-50 text-blue-700 ring-blue-600/20",
  preparing: "bg-amber-50 text-amber-800 ring-amber-600/20",
  ready: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  out_for_delivery: "bg-violet-50 text-violet-700 ring-violet-600/20",
  delivered: "bg-green-50 text-green-700 ring-green-600/20",
  cancelled: "bg-red-50 text-red-700 ring-red-600/20",
};

const statusLabel = (status) =>
  String(status || "unknown")
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export default function OrderTable({ orders, sort, dir, page, totalPages }) {
  function sortHref(key) {
    const nextDir = sort === key && dir === "asc" ? "desc" : "asc";
    return `/orders?sort=${key}&dir=${nextDir}&page=1`;
  }

  function pageHref(nextPage) {
    return `/orders?sort=${sort}&dir=${dir}&page=${nextPage}`;
  }

  return (
    <>
      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="font-bold text-gray-950">Order history</h2>
            <p className="mt-1 text-sm text-gray-500">Select a column to sort your orders.</p>
          </div>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">{orders.length} on this page</span>
        </div>

        {orders.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="font-semibold text-gray-800">No orders on this page</p>
            <p className="mt-1 text-sm text-gray-500">Try another page or place an order from the menu.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] border-collapse text-left text-sm">
              <thead className="bg-gray-50/80">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      aria-sort={sort === column.key ? (dir === "asc" ? "ascending" : "descending") : "none"}
                      className={`border-b border-gray-200 px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 ${column.key === "total" ? "text-right" : ""}`}
                    >
                      <Link href={sortHref(column.key)} className="inline-flex items-center gap-1 hover:text-violet-700">
                        {column.label}
                        <span aria-hidden="true" className="text-violet-600">
                          {sort === column.key ? (dir === "asc" ? "↑" : "↓") : "↕"}
                        </span>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-violet-50/40">
                    <th scope="row" className="whitespace-nowrap px-5 py-5 font-semibold">
                      <Link href={`/orders/${order.id}`} className="text-violet-700 hover:text-violet-900 hover:underline">
                        #{order.id}
                      </Link>
                    </th>
                    <td className="px-5 py-5 text-gray-700">{order.area || "—"}</td>
                    <td className="px-5 py-5">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[order.status] || "bg-gray-100 text-gray-700 ring-gray-300"}`}>
                        {statusLabel(order.status)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-5 text-right font-semibold tabular-nums text-gray-950">
                      {formatETB(Number(order.total || 0))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <nav aria-label="Order pages" className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">Page <span className="font-semibold text-gray-800">{page}</span> of <span className="font-semibold text-gray-800">{totalPages}</span></p>
        <div className="flex gap-2">
          {page > 1 ? (
            <Link href={pageHref(page - 1)} rel="prev" className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">← Previous</Link>
          ) : (
            <span className="cursor-not-allowed rounded-xl border border-gray-100 px-4 py-2.5 text-sm text-gray-300">← Previous</span>
          )}
          {page < totalPages ? (
            <Link href={pageHref(page + 1)} rel="next" className="rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800">Next →</Link>
          ) : (
            <span className="cursor-not-allowed rounded-xl border border-gray-100 px-4 py-2.5 text-sm text-gray-300">Next →</span>
          )}
        </div>
      </nav>
    </>
  );
}
