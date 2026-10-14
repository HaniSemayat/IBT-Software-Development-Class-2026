import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "../../../lib/session";
import { getAllOrders } from "../../../lib/orders";

export const metadata = {
  title: "All Orders",
  description: "Review all Addis Eats customer orders.",
  robots: { index: false, follow: false },
};

function formatETB(value) {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

export default async function AdminOrdersPage() {
  const session = await getSession();

  if (!session) {
    redirect("/signin?next=/admin/orders");
  }

  if (session.role !== "staff") {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-bold">Access denied</h1>
        <p className="mt-3 text-gray-600">
          Only authorized staff can view all customer orders.
        </p>
        <Link href="/" className="mt-5 inline-block font-semibold text-orange-600">
          Return home
        </Link>
      </main>
    );
  }

  const orders = await getAllOrders();

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link
        href="/admin"
        className="text-sm font-semibold text-orange-600 hover:text-orange-700"
      >
        ← Back to Admin Panel
      </Link>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
            Staff workspace
          </p>
          <h1 className="mt-2 text-3xl font-bold">All Orders</h1>
          <p className="mt-2 text-gray-600">
            Review orders placed by customers across the restaurant.
          </p>
        </div>
        <div className="rounded-xl border bg-white px-5 py-3">
          <p className="text-sm text-gray-500">Total orders</p>
          <p className="text-2xl font-bold">{orders.length}</p>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        {orders.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <h2 className="text-lg font-semibold">No orders yet</h2>
            <p className="mt-2 text-gray-500">
              Customer orders will appear here when they are placed.
            </p>
          </div>
        ) : (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-4">Order</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Items</th>
                <th className="px-5 py-4">Total</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-semibold">#{order.id}</td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">
                      {order.name || "Customer"}
                    </p>
                    <p className="mt-1 text-gray-500">
                      {order.phone || "No phone provided"}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {Array.isArray(order.items)
                      ? order.items.reduce(
                          (total, item) => total + (Number(item.quantity) || 1),
                          0
                        )
                      : 0}{" "}
                    item(s)
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 font-semibold">
                    {formatETB(order.total)}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold capitalize text-orange-700">
                      {String(order.status || "placed").replaceAll("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/dashboard"
          className="rounded-lg border border-gray-300 px-4 py-2 font-semibold hover:border-orange-500 hover:text-orange-600"
        >
          Dashboard
        </Link>
        <Link
          href="/kitchen"
          className="rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-700"
        >
          Open Kitchen
        </Link>
      </div>
    </main>
  );
}
