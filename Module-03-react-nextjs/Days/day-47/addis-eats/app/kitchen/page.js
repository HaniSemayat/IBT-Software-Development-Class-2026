import { redirect } from "next/navigation";
import { getSession } from "../../lib/session";
import { getAllOrders } from "../../lib/orders";
import { updateOrderStatus } from "../actions";

export const metadata = {
  title: "Kitchen Dashboard",
  description: "Staff-only Addis Eats kitchen dashboard.",
  robots: { index: false, follow: false },
};

const statuses = [
  { value: "placed", label: "Placed" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "out_for_delivery", label: "Out for delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

function statusStyle(status) {
  const styles = {
    placed: "bg-blue-50 text-blue-700 ring-blue-200",
    preparing: "bg-amber-50 text-amber-700 ring-amber-200",
    ready: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    out_for_delivery: "bg-orange-50 text-orange-700 ring-orange-200",
    delivered: "bg-green-50 text-green-700 ring-green-200",
    cancelled: "bg-red-50 text-red-700 ring-red-200",
  };

  return styles[status] || "bg-stone-100 text-stone-700 ring-stone-200";
}

function formatTime(value) {
  if (!value) return "Time unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Time unavailable";

  return date.toLocaleString("en-ET", {
    timeZone: "Africa/Addis_Ababa",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function KitchenPage() {
  const session = await getSession();

  if (!session) redirect("/signin?next=/kitchen");

  if (session.role !== "staff") {
    return (
      <main className="min-h-screen bg-stone-50 px-4 py-16 sm:px-6">
        <section className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-bold uppercase tracking-widest text-red-600">
            Restricted area
          </p>
          <h1 className="mt-3 text-3xl font-bold text-stone-900">
            Access denied
          </h1>
          <p className="mt-3 leading-7 text-stone-600">
            Your account does not have permission to access the kitchen dashboard.
          </p>
          <a
            href="/"
            className="mt-6 inline-flex rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700"
          >
            Return home
          </a>
        </section>
      </main>
    );
  }

  const orders = await getAllOrders();
  const activeCount = orders.filter(
    (order) => !["delivered", "cancelled"].includes(order.status)
  ).length;
  const placedCount = orders.filter((order) => order.status === "placed").length;
  const preparingCount = orders.filter(
    (order) => order.status === "preparing"
  ).length;
  const readyCount = orders.filter((order) => order.status === "ready").length;

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 border-b border-stone-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
              Addis Eats / Staff workspace
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              Kitchen dashboard
            </h1>
            <p className="mt-3 text-sm leading-6 text-stone-600 sm:text-base">
              Welcome, {session.name}. Manage incoming orders and update their status.
            </p>
          </div>

          <div className="rounded-xl border border-orange-100 bg-orange-50 px-5 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-700">
              Orders to manage
            </p>
            <p className="mt-1 text-3xl font-extrabold text-stone-900">
              {activeCount}
            </p>
          </div>
        </header>

        <section
          aria-label="Order status summary"
          className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
        >
          {[
            { label: "Total orders", value: orders.length, color: "text-stone-900" },
            { label: "New orders", value: placedCount, color: "text-blue-700" },
            { label: "Preparing", value: preparingCount, color: "text-amber-700" },
            { label: "Ready", value: readyCount, color: "text-emerald-700" },
          ].map((stat) => (
            <article
              key={stat.label}
              className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <p className="text-sm font-medium text-stone-500">{stat.label}</p>
              <p className={`mt-2 text-3xl font-extrabold ${stat.color}`}>
                {stat.value}
              </p>
            </article>
          ))}
        </section>

        <div className="mb-5 mt-10 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-stone-900">Incoming orders</h2>
            <p className="mt-1 text-sm text-stone-500">
              Most recent orders appear first.
            </p>
          </div>
          <span className="text-sm font-medium text-stone-500">
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </span>
        </div>

        {orders.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-2xl">
              +
            </div>
            <h3 className="mt-4 text-lg font-bold text-stone-900">
              No orders yet
            </h3>
            <p className="mt-2 text-sm text-stone-500">
              New customer orders will appear here.
            </p>
          </section>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const items = Array.isArray(order.items) ? order.items : [];

              return (
                <article
                  key={order.id}
                  className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 border-b border-stone-100 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-bold text-stone-900">
                          Order #{order.id}
                        </h3>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ring-1 ring-inset ${statusStyle(order.status)}`}
                        >
                          {String(order.status).replaceAll("_", " ")}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-stone-500">
                        Received {formatTime(order.createdAt)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-orange-50 px-4 py-3 sm:text-right">
                      <p className="text-xs font-semibold uppercase tracking-wider text-orange-700">
                        Order total
                      </p>
                      <p className="mt-1 text-xl font-extrabold text-stone-900">
                        ETB {Number(order.total || 0).toLocaleString("en-ET")}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
                    <section>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        Customer and delivery
                      </h4>
                      <dl className="mt-3 space-y-3 text-sm">
                        <div>
                          <dt className="text-stone-500">Customer</dt>
                          <dd className="mt-0.5 font-semibold text-stone-900">
                            {order.name || "Not provided"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-stone-500">Phone</dt>
                          <dd className="mt-0.5 font-semibold text-stone-900">
                            {order.phone || "Not provided"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-stone-500">Delivery area</dt>
                          <dd className="mt-0.5 font-semibold text-stone-900">
                            {order.area || "Not provided"}
                          </dd>
                        </div>
                      </dl>
                    </section>

                    <section>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        Items ordered
                      </h4>
                      {items.length === 0 ? (
                        <p className="mt-3 text-sm text-stone-500">
                          Item details unavailable.
                        </p>
                      ) : (
                        <ul className="mt-3 divide-y divide-stone-100">
                          {items.map((item, index) => (
                            <li
                              key={`${item.id ?? item.name ?? "item"}-${index}`}
                              className="flex items-center justify-between gap-3 py-2.5 text-sm"
                            >
                              <span className="font-medium text-stone-800">
                                {item.name || "Menu item"}
                              </span>
                              <span className="shrink-0 rounded-lg bg-stone-100 px-2.5 py-1 font-bold text-stone-700">
                                x{item.quantity ?? 1}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </section>
                  </div>

                  <form
                    action={updateOrderStatus}
                    className="border-t border-stone-100 bg-stone-50 p-5 sm:px-6"
                  >
                    <input type="hidden" name="orderId" value={order.id} />

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                      <div className="flex-1">
                        <label
                          htmlFor={`status-${order.id}`}
                          className="mb-2 block text-sm font-semibold text-stone-700"
                        >
                          Update order status
                        </label>
                        <select
                          id={`status-${order.id}`}
                          name="status"
                          defaultValue={order.status}
                          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                        >
                          {statuses.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="inline-flex min-h-12 items-center justify-center rounded-xl bg-orange-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                      >
                        Save status
                      </button>
                    </div>
                  </form>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
