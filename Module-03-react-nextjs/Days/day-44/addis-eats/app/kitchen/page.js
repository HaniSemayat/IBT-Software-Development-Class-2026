import { redirect } from "next/navigation";
import { getSession } from "../../lib/session";

export const metadata = {
  title: "Kitchen Dashboard",
  description: "Staff-only Addis Eats kitchen dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function KitchenPage() {
  const session = await getSession();

  if (!session) {
    redirect("/signin?next=/kitchen");
  }

  if (session.role !== "staff") {
    return (
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Access denied
        </h1>

        <p className="mt-3 text-gray-300">
          You do not have permission to access the kitchen.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
        Addis Eats
      </p>

      <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">
        Kitchen Dashboard
      </h1>

      <p className="mt-3 text-gray-300">
        Welcome, {session.name}. You have staff access.
      </p>

      <div className="mt-8 rounded-lg border border-gray-700 bg-gray-900 p-6">
        <p className="font-semibold text-white">
          Staff-only area
        </p>

        <p className="mt-2 text-sm text-gray-300">
          Kitchen order management will live here.
        </p>
      </div>
    </main>
  );
}
