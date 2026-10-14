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
        <h1 className="text-3xl font-bold text-gray-950">Access denied</h1>
        <p className="mt-3 text-gray-700">This dashboard is available to authorised staff only.</p>
        <Link href="/" className="mt-5 inline-block font-semibold text-violet-700 underline">Return home</Link>
      </main>
    );
  }

  const analytics = await getDashboardAnalytics();
  const cancelled = analytics.statusBreakdown.find((item) => item.status === "cancelled")?.count ?? 0;
  const delivered = analytics.statusBreakdown.find((item) => item.status === "delivered")?.count ?? 0;
  const active = analytics.totalOrders - cancelled - delivered;

  return (
    <main className="min-h-[70vh] bg-gray-50/70">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-700">Addis Eats · Staff</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">Analytics overview</h1>
            <p className="mt-2 text-sm text-gray-600">
              Welcome, {session.name}. Order activity from {analytics.dateRange.start} to {analytics.dateRange.end} (UTC).
            </p>
          </div>
          <Link href="/kitchen" className="inline-flex items-center justify-center rounded-xl bg-gray-950 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-gray-800">
            Open kitchen <span className="ml-2" aria-hidden="true">→</span>
          </Link>
        </header>

        <section aria-label="Key performance indicators" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-500">Total orders</p>
            <p className="mt-3 text-3xl font-extrabold tabular-nums text-gray-950">{analytics.totalOrders}</p>
            <p className="mt-2 text-xs text-gray-500">All order statuses</p>
          </article>
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-500">Revenue</p>
            <p className="mt-3 text-3xl font-extrabold tabular-nums text-gray-950">{formatETB(analytics.totalRevenue)}</p>
            <p className="mt-2 text-xs text-gray-500">Excludes cancelled orders</p>
          </article>
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-500">In progress</p>
            <p className="mt-3 text-3xl font-extrabold tabular-nums text-violet-700">{active}</p>
            <p className="mt-2 text-xs text-gray-500">Not delivered or cancelled</p>
          </article>
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-500">Delivered</p>
            <p className="mt-3 text-3xl font-extrabold tabular-nums text-emerald-700">{delivered}</p>
            <p className="mt-2 text-xs text-gray-500">Successfully completed</p>
          </article>
        </section>

        {analytics.totalOrders === 0 && (
          <section className="rounded-2xl border border-dashed border-gray-300 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-950">Waiting for the first order</h2>
            <p className="mt-2 text-sm text-gray-600">The charts below show the current seven-day activity. Real order data will appear as customers place orders.</p>
          </section>
        )}

        <section aria-label="Order and revenue charts" className="grid items-start gap-6 xl:grid-cols-2">
          <RevenueChart data={analytics.revenue} />
          <OrdersLineChart data={analytics.ordersOverTime} />
          <StatusBreakdownChart data={analytics.statusBreakdown} />
        </section>

        <p className="text-xs text-gray-400">Analytics use current in-memory order data. Orders may be lost when the development server restarts.</p>
      </div>
    </main>
  );
}
