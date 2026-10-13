import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "../../lib/session";
import { getOrdersByUser } from "../../lib/orders";
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
  const safePage = Number.isSafeInteger(parsedPage) && parsedPage > 0
    ? parsedPage
    : 1;

  const allOrders = await getOrdersByUser(session.id);

  const sortedOrders = [...allOrders].sort((a, b) => {
    let comparison;

    if (sort === "total") {
      comparison = Number(a.total || 0) - Number(b.total || 0);
    } else if (sort === "id") {
      comparison = Number(a.id) - Number(b.id);
    } else {
      comparison = String(a[sort] ?? "").localeCompare(
        String(b[sort] ?? ""),
        undefined,
        { numeric: true, sensitivity: "base" }
      );
    }

    return (dir === "asc" ? 1 : -1) * comparison;
  });

  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil(sortedOrders.length / pageSize));
  const page = Math.min(safePage, totalPages);
  const visibleOrders = sortedOrders.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-gray-950">
        My Orders
      </h1>
      <p className="mt-2 text-gray-700">
        Orders belonging to {session.name}. Sort by selecting a table heading.
      </p>

      {allOrders.length === 0 ? (
        <section className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-6">
          <h2 className="text-lg font-bold text-gray-950">No orders yet</h2>
          <p className="mt-2 text-gray-700">
            Once you place an order, you can track its status here.
          </p>
          <Link
            href="/menu"
            className="mt-4 inline-block font-semibold text-violet-700 underline"
          >
            Browse the menu
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
    </main>
  );
}
