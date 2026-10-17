import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "../../lib/session";

export const metadata = {
  title: "Admin Panel",
  description: "Staff workspace for Addis Eats.",
  robots: { index: false, follow: false },
};

const tools = [
  {
    title: "Dashboard",
    description: "Review sales, order activity, and business performance.",
    href: "/dashboard",
    label: "View analytics",
  },
  {
    title: "All Orders",
    description: "Review customer orders across Addis Eats.",
    href: "/admin/orders",
    label: "Manage orders",
  },
  {
    title: "Kitchen",
    description: "Monitor incoming orders and update their preparation status.",
    href: "/kitchen",
    label: "Open kitchen",
  },
];

export default async function AdminPage() {
  const session = await getSession();

  if (!session) {
    redirect("/signin?next=/admin");
  }

  if (session.role !== "staff") {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-2xl border border-red-200 bg-white p-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-red-600">
            Access restricted
          </p>
          <h1 className="mt-3 text-3xl font-bold">Staff only</h1>
          <p className="mt-3 text-gray-600">
            Your account does not have permission to access the admin panel.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700"
          >
            Return to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="rounded-3xl bg-gray-900 px-8 py-10 text-white sm:px-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-orange-300">
          Addis Eats · Staff workspace
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          Welcome, {session.name}
        </h1>
        <p className="mt-3 max-w-2xl text-gray-300">
          Manage orders, monitor kitchen activity, and review restaurant
          performance from one place.
        </p>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">Your workspace</h2>
        <p className="mt-2 text-gray-600">
          Choose a staff tool to get started.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {tools.map((tool) => (
            <article
              key={tool.href}
              className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold">{tool.title}</h3>
              <p className="mt-3 flex-1 leading-7 text-gray-600">
                {tool.description}
              </p>
              <Link
                href={tool.href}
                className="mt-6 inline-flex items-center font-semibold text-orange-600 hover:text-orange-700"
              >
                {tool.label} <span className="ml-2" aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

