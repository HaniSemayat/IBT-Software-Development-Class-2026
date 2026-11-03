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
    <main className="min-h-[70vh] bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
              Your account
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              My orders
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-muted">
              Welcome, {session.name}. Follow your deliveries and review your order history.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/api/orders/export"
              download
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Download CSV
            </a>

            <Link
              href="/menu"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Browse menu
            </Link>
          </div>
        </header>

        <section
          aria-label="Order summary"
          className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <p className="text-sm font-medium text-muted">Total orders</p>
            <p className="mt-4 text-3xl font-bold tabular-nums text-foreground">
              {allOrders.length}
            </p>
            <p className="mt-1 text-xs text-muted">All-time order history</p>
          </article>

          <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <p className="text-sm font-medium text-muted">In progress</p>
            <p className="mt-4 text-3xl font-bold tabular-nums text-foreground">
              {activeOrders}
            </p>
            <p className="mt-1 text-xs text-muted">Orders not yet completed</p>
          </article>

          <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:col-span-2 xl:col-span-1">
            <p className="text-sm font-medium text-muted">Non-cancelled total</p>
            <p className="mt-4 text-3xl font-bold tabular-nums text-foreground">
              {formatETB(eligibleTotal)}
            </p>
            <p className="mt-1 text-xs text-muted">
              {deliveredOrders} delivered {deliveredOrders === 1 ? "order" : "orders"}
            </p>
          </article>
        </section>

        {allOrders.length === 0 ? (
          <section className="mt-8 rounded-3xl border border-dashed border-border bg-surface px-6 py-14 text-center sm:px-10">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brand">
              Addis Eats
            </p>

            <h2 className="mt-4 text-xl font-bold text-foreground">
              Your next favourite meal starts here
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted">
              You haven&apos;t placed an order yet. Explore the menu and your orders will appear here.
            </p>

            <Link
              href="/menu"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Explore the menu
            </Link>
          </section>
        ) : (
          <OrderTable
            orders={visibleOrders}
            sort={sort}
            dir={dir}
            page={page}
            totalPages={totalPages}
          />
        )}

        <p className="mt-6 text-xs text-muted">
          Order information is associated with your signed-in account.
        </p>
      </div>
    </main>
  );
}
