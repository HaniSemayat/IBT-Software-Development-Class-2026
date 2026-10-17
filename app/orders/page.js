import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "../../lib/session";
import { getOrdersByUser } from "../../lib/orders";
import { formatETB } from "../../lib/format";
import OrderTable from "./OrderTable";

export const metadata = {
  title: "My Orders",
  description: "View and sort your Addis Eats order history.",
  robots: { index: false, follow: false },
};

const validSorts = ["id", "area", "status", "total"];

export default async function OrdersPage({ searchParams }) {
  const session = await getSession();

  if (!session) {
    redirect("/signin?next=/orders");
  }

  const params = await searchParams;
  const requestedSort = Array.isArray(params?.sort) ? params.sort[0] : params?.sort;
  const requestedDir = Array.isArray(params?.dir) ? params.dir[0] : params?.dir;
  const requestedPage = Array.isArray(params?.page) ? params.page[0] : params?.page;

  const sort = validSorts.includes(requestedSort) ? requestedSort : "id";
  const dir = requestedDir === "asc" ? "asc" : "desc";
  const parsedPage = Number(requestedPage);
  const safePage = Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const allOrders = await getOrdersByUser(session.id);
  const activeOrders = allOrders.filter((order) => !["delivered", "cancelled"].includes(order.status)).length;
  const deliveredOrders = allOrders.filter((order) => order.status === "delivered").length;
  const eligibleTotal = allOrders.reduce((sum, order) => sum + (order.status === "cancelled" ? 0 : Number(order.total || 0)), 0);

  const sortedOrders = [...allOrders].sort((a, b) => {
    let comparison;

    if (sort === "total") {
      comparison = Number(a.total || 0) - Number(b.total || 0);
    } else if (sort === "id") {
      comparison = Number(a.id) - Number(b.id);
    } else {
      comparison = String(a[sort] ?? "").localeCompare(String(b[sort] ?? ""), undefined, {
        numeric: true,
        sensitivity: "base",
      });
    }

    return (dir === "asc" ? 1 : -1) * comparison;
  });

  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil(sortedOrders.length / pageSize));
  const page = Math.min(safePage, totalPages);
  const visibleOrders = sortedOrders.slice((page - 1) * pageSize, page * pageSize);

  return (
    <main className="min-h-[70vh] bg-gray-50/70">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-700">Your account</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">My orders</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">
              Welcome, {session.name}. Follow your deliveries and review your order history.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="/api/orders/export"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-800 shadow-sm transition hover:border-violet-300 hover:text-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
            >
              <span aria-hidden="true">↓</span> Download CSV
            </a>
            <Link href="/menu" className="inline-flex items-center justify-center rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-violet-800">
              Browse menu <span className="ml-2" aria-hidden="true">→</span>
            </Link>
          </div>
        </header>

        <section aria-label="Order summary" className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-500">Total orders</p>
              <span className="rounded-xl bg-violet-50 p-2 text-lg" aria-hidden="true">▤</span>
            </div>
            <p className="mt-4 text-3xl font-extrabold tabular-nums text-gray-950">{allOrders.length}</p>
            <p className="mt-1 text-xs text-gray-500">All-time order history</p>
          </article>
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-500">In progress</p>
              <span className="rounded-xl bg-amber-50 p-2 text-lg" aria-hidden="true">◷</span>
            </div>
            <p className="mt-4 text-3xl font-extrabold tabular-nums text-gray-950">{activeOrders}</p>
            <p className="mt-1 text-xs text-gray-500">Orders not yet completed</p>
          </article>
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-500">Non-cancelled total</p>
              <span className="rounded-xl bg-emerald-50 p-2 text-lg" aria-hidden="true">₿</span>
            </div>
            <p className="mt-4 text-3xl font-extrabold tabular-nums text-gray-950">{formatETB(eligibleTotal)}</p>
            <p className="mt-1 text-xs text-gray-500">{deliveredOrders} delivered {deliveredOrders === 1 ? "order" : "orders"}</p>
          </article>
        </section>

        {allOrders.length === 0 ? (
          <section className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
            <span className="text-4xl" aria-hidden="true">🛍️</span>
            <h2 className="mt-4 text-xl font-bold text-gray-950">Your next favourite meal starts here</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              You haven't placed an order yet. Explore the menu and your orders will appear here.
            </p>
            <Link href="/menu" className="mt-6 inline-flex rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white hover:bg-violet-800">
              Explore the menu
            </Link>
          </section>
        ) : (
          <OrderTable orders={visibleOrders} sort={sort} dir={dir} page={page} totalPages={totalPages} />
        )}

        <p className="mt-6 text-xs text-gray-400">Order information is associated with your signed-in account.</p>
      </div>
    </main>
  );
}
