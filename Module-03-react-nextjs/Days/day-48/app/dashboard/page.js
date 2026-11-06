import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "../../lib/session";
import { getDashboardAnalytics } from "../../lib/orders";
import RevenueChart from "./RevenueChart";
import OrdersLineChart from "./OrdersLineChart";
import StatusBreakdownChart from "./StatusBreakdownChart";

export const metadata = {
  title: "Analytics Dashboard",
  description: "Staff analytics for Addis Eats orders and revenue.",
  robots: { index: false, follow: false },
};

const formatETB = (value) =>
  new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(value);

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) redirect("/signin?next=/dashboard");

  if (session.role !== "staff") {
    return (
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-2xl border border-border bg-surface p-8">
          <p className="text-sm font-semibold text-brand">Restricted area</p>
          <h1 className="mt-2 text-3xl font-bold text-foreground">Access denied</h1>
          <p className="mt-3 text-muted">
            This dashboard is available to authorised staff only.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex rounded-lg font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Return home
          </Link>
        </div>
      </main>
    );
  }

  const analytics = await getDashboardAnalytics();
  const cancelled =
    analytics.statusBreakdown.find((item) => item.status === "cancelled")?.count ?? 0;
  const delivered =
    analytics.statusBreakdown.find((item) => item.status === "delivered")?.count ?? 0;
  const active = analytics.totalOrders - cancelled - delivered;

  return (
    <main className="min-h-[70vh] bg-background">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
              Addis Eats · Staff
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Analytics overview
            </h1>
            <p className="mt-2 text-sm text-muted">
              Welcome, {session.name}. Order activity from {analytics.dateRange.start} to {analytics.dateRange.end} (UTC).
            </p>
          </div>
          <Link
            href="/kitchen"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            Open kitchen
          </Link>
        </header>

        <section aria-label="Key performance indicators" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <p className="text-sm font-semibold text-muted">Total orders</p>
            <p className="mt-3 text-3xl font-extrabold tabular-nums text-foreground">{analytics.totalOrders}</p>
            <p className="mt-2 text-xs text-muted">All order statuses</p>
          </article>
          <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <p className="text-sm font-semibold text-muted">Revenue</p>
            <p className="mt-3 text-3xl font-extrabold tabular-nums text-foreground">{formatETB(analytics.totalRevenue)}</p>
            <p className="mt-2 text-xs text-muted">Excludes cancelled orders</p>
          </article>
          <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <p className="text-sm font-semibold text-muted">In progress</p>
            <p className="mt-3 text-3xl font-extrabold tabular-nums text-brand">{active}</p>
            <p className="mt-2 text-xs text-muted">Not delivered or cancelled</p>
          </article>
          <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <p className="text-sm font-semibold text-muted">Delivered</p>
            <p className="mt-3 text-3xl font-extrabold tabular-nums text-success">{delivered}</p>
            <p className="mt-2 text-xs text-muted">Successfully completed</p>
          </article>
        </section>

        {analytics.totalOrders === 0 && (
          <section className="rounded-2xl border border-dashed border-border bg-surface p-6">
            <h2 className="text-lg font-bold text-foreground">Waiting for the first order</h2>
            <p className="mt-2 text-sm text-muted">
              The charts below show the current seven-day activity. Real order data will appear as customers place orders.
            </p>
          </section>
        )}

        <section aria-label="Order and revenue charts" className="grid items-start gap-6 xl:grid-cols-2">
          <RevenueChart data={analytics.revenue} />
          <OrdersLineChart data={analytics.ordersOverTime} />
          <StatusBreakdownChart data={analytics.statusBreakdown} />
        </section>

        <p className="text-xs text-muted">
          Analytics use current in-memory order data. Orders may be lost when the development server restarts.
        </p>
      </div>
    </main>
  );
}
