import Link from "next/link";

const columns = [
  { key: "id", label: "Order" },
  { key: "area", label: "Neighbourhood" },
  { key: "status", label: "Status" },
  { key: "total", label: "Total (ETB)" },
];

const money = new Intl.NumberFormat("en-ET", {
  style: "currency",
  currency: "ETB",
  maximumFractionDigits: 0,
});

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
      <div className="mt-8 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="p-4 text-left font-semibold text-gray-800">
            Your orders. Select a column heading to sort.
          </caption>
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={
                    sort === column.key
                      ? dir === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  className={`border-b border-gray-200 px-4 py-3 font-semibold text-gray-800 ${
                    column.key === "total" ? "text-right" : ""
                  }`}
                >
                  <Link
                    href={sortHref(column.key)}
                    className="underline decoration-gray-400 underline-offset-4 hover:text-violet-700"
                  >
                    {column.label}
                    {sort === column.key ? (dir === "asc" ? " ↑" : " ↓") : ""}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-100 last:border-0">
                <th scope="row" className="px-4 py-4 font-semibold text-gray-900">
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-violet-700 underline underline-offset-2"
                  >
                    #{order.id}
                  </Link>
                </th>
                <td className="px-4 py-4 text-gray-800">{order.area}</td>
                <td className="px-4 py-4 capitalize text-gray-800">{order.status}</td>
                <td className="px-4 py-4 text-right tabular-nums text-gray-900">
                  {money.format(Number(order.total || 0))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <nav
        aria-label="Order pages"
        className="mt-5 flex items-center justify-between gap-4"
      >
        <p className="text-sm text-gray-700">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-3">
          {page > 1 ? (
            <Link
              href={pageHref(page - 1)}
              rel="prev"
              className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-100"
            >
              Previous
            </Link>
          ) : (
            <span className="rounded-lg border border-gray-200 px-4 py-2 text-gray-400">
              Previous
            </span>
          )}
          {page < totalPages ? (
            <Link
              href={pageHref(page + 1)}
              rel="next"
              className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-100"
            >
              Next
            </Link>
          ) : (
            <span className="rounded-lg border border-gray-200 px-4 py-2 text-gray-400">
              Next
            </span>
          )}
        </div>
      </nav>
    </>
  );
}
