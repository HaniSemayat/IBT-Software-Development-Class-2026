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
      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2 className="font-bold text-foreground">Order history</h2>
            <p className="mt-1 text-sm text-muted">
              Select a column to sort your orders.
            </p>
          </div>

          <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-muted">
            {orders.length} on this page
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="font-semibold text-foreground">No orders on this page</p>
            <p className="mt-1 text-sm text-muted">
              Try another page or place an order from the menu.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] border-collapse text-left text-sm">
              <thead className="bg-background">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      aria-sort={sort === column.key ? (dir === "asc" ? "ascending" : "descending") : "none"}
                      className={`border-b border-border px-5 py-4 text-xs font-bold uppercase tracking-wider text-muted ${
                        column.key === "total" ? "text-right" : ""
                      }`}
                    >
                      <Link
                        href={sortHref(column.key)}
                        className="inline-flex items-center gap-1 transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                      >
                        {column.label}
                        <span aria-hidden="true" className="text-brand">
                          {sort === column.key ? (dir === "asc" ? "↑" : "↓") : "↕"}
                        </span>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-brand-soft/40"
                  >
                    <th scope="row" className="whitespace-nowrap px-5 py-5 font-semibold">
                      <Link
                        href={`/orders/${order.id}`}
                        className="text-brand transition-colors hover:text-brand-hover hover:underline"
                      >
                        #{order.id}
                      </Link>
                    </th>

                    <td className="px-5 py-5 text-foreground">
                      {order.area || "—"}
                    </td>

                    <td className="px-5 py-5">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                          statusStyles[order.status] || "bg-gray-100 text-gray-700 ring-gray-300"
                        }`}
                      >
                        {statusLabel(order.status)}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-5 text-right font-semibold tabular-nums text-foreground">
                      {formatETB(Number(order.total || 0))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <nav
        aria-label="Order pages"
        className="mt-5 flex flex-wrap items-center justify-between gap-3"
      >
        <p className="text-sm text-muted">
          Page <span className="font-semibold text-foreground">{page}</span> of{" "}
          <span className="font-semibold text-foreground">{totalPages}</span>
        </p>

        <div className="flex gap-2">
          {page > 1 ? (
            <Link
              href={pageHref(page - 1)}
              rel="prev"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-background"
            >
              Previous
            </Link>
          ) : (
            <span className="inline-flex min-h-11 cursor-not-allowed items-center justify-center rounded-xl border border-border px-4 py-2.5 text-sm text-muted/50">
              Previous
            </span>
          )}

          {page < totalPages ? (
            <Link
              href={pageHref(page + 1)}
              rel="next"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
            >
              Next
            </Link>
          ) : (
            <span className="inline-flex min-h-11 cursor-not-allowed items-center justify-center rounded-xl border border-border px-4 py-2.5 text-sm text-muted/50">
              Next
            </span>
          )}
        </div>
      </nav>
    </>
  );
}
