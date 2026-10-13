import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "../../lib/session";
import { getDashboardAnalytics } from "../../lib/orders";
import RevenueChart from "./RevenueChart";
import OrdersLineChart from "./OrdersLineChart";

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

  if (!session) {
    redirect("/signin?next=/dashboard");
  }

  if (session.role !== "staff") {
    return (
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-950">Access denied</h1>
        <p className="mt-3 text-gray-700">
          This dashboard is available to authorised staff only.
        </p>
        <Link href="/" className="mt-5 inline-block font-semibold text-violet-700 underline">
          Return home
        </Link>
      </main>
    );
  }

  const analytics = await getDashboardAnalytics();

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <header>
        <p className="text-sm font-semibold uppercase tracking-widest text-violet-700">
          Addis Eats · Staff
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
          Analytics dashboard
        </h1>
        <p className="mt-2 text-gray-700">
          Welcome, {session.name}. Seven-day order activity: {analytics.dateRange.start} to {analytics.dateRange.end} (UTC).
        </p>
      </header>

      <section aria-label="Order summary" className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-gray-600">All orders</h2>
          <p className="mt-2 text-3xl font-bold tabular-nums text-gray-950">
            {analytics.totalOrders}
          </p>
        </article>
        <article className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-gray-600">
            Revenue excluding cancelled orders
          </h2>
          <p className="mt-2 text-3xl font-bold tabular-nums text-gray-950">
            {formatETB(analytics.totalRevenue)}
          </p>
        </article>
      </section>

      {analytics.totalOrders === 0 ? (
        <section className="rounded-xl border border-dashed border-gray-300 bg-white p-6">
          <h2 className="text-lg font-bold text-gray-950">No orders yet</h2>
          <p className="mt-2 text-gray-700">
            The charts will populate when customers place orders. This dashboard uses live in-memory order data, not sample figures.
          </p>
          <Link href="/menu" className="mt-4 inline-block font-semibold text-violet-700 underline">
            Browse the menu
          </Link>
        </section>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <RevenueChart data={analytics.revenue} />
        <OrdersLineChart data={analytics.ordersOverTime} />
      </div>

      <p className="text-sm text-gray-600">
        Order records are currently stored in memory and may be lost when the server restarts.
      </p>
    </main>
  );
}
