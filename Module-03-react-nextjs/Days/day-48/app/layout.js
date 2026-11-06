import Link from "next/link";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import Providers from "./Providers";
import UserMenu from "./UserMenu";
import MobileNav from "./MobileNav";
import CartNavLink from "../components/CartNavLink";
import FavoritesNavLink from "../components/FavoritesNavLink";
import { getSession } from "../lib/session";



export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "Addis Eats | Ethiopian Food Delivery",
    template: "%s | Addis Eats",
  },
  description:
    "Discover Ethiopian favorites, fresh meals, and drinks on Addis Eats. Explore the menu and order your next meal.",
  openGraph: {
    type: "website",
    siteName: "Addis Eats",
    title: "Addis Eats | Ethiopian Food Delivery",
    description:
      "Discover Ethiopian favorites, fresh meals, and drinks on Addis Eats.",
  },
};

const linkClass =
  "inline-flex min-h-11 items-center whitespace-nowrap rounded-md px-1 text-sm font-medium text-muted transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

export default async function RootLayout({ children }) {
  const session = await getSession();
  const isStaff = session?.role === "staff";

  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <Providers>
          <header className="sticky top-0 z-50 border-b border-border bg-surface shadow-sm">
            <nav className="mx-auto flex h-[76px] max-w-screen-2xl items-center justify-between gap-3 px-6 sm:px-10 lg:px-12">
              <Link href="/" className="shrink-0 text-xl font-bold text-brand">
                Addis Eats
              </Link>

              <div className="hidden items-center gap-3 lg:flex xl:gap-4">
                {isStaff ? (
                  <>
                    <Link href="/admin" className={linkClass}>Admin Panel</Link>
                    <Link href="/dashboard" className={linkClass}>Dashboard</Link>
                    <Link href="/admin/orders" className={linkClass}>All Orders</Link>
                    <Link href="/kitchen" className={linkClass}>Kitchen</Link>
                    <Link href="/menu" className={linkClass}>Customer Menu</Link>
                  </>
                ) : (
                  <>
                    <Link href="/" className={linkClass}>Home</Link>
                    <Link href="/menu" className={linkClass}>Menu</Link>
                    <FavoritesNavLink />
                    <CartNavLink />
                    <Link href="/checkout" className={linkClass}>Checkout</Link>
                    {session && (
                      <Link href="/orders" className={linkClass}>My Orders</Link>
                    )}
                  </>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                {!isStaff && <div className="lg:hidden"><CartNavLink /></div>}
                <UserMenu session={session} />
                <div className="lg:hidden">
                  <MobileNav session={session} isStaff={isStaff} />
                </div>
              </div>
            </nav>
          </header>

          <main className="min-h-[calc(100vh-137px)] px-3 sm:px-5 lg:px-8">{children}</main>

          <footer className="mt-16 border-t border-border bg-surface">
            <div className="mx-auto grid max-w-screen-2xl gap-10 px-6 py-14 sm:px-10 lg:px-12 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <Link href="/" className="text-xl font-bold text-brand">
                  Addis Eats
                </Link>
                <p className="mt-3 max-w-xs text-sm leading-6 text-muted">
                  Discover Ethiopian favorites, order fresh meals, and enjoy
                  great food delivered with care.
                </p>
              </div>

              <div>
                <h2 className="font-semibold text-foreground">Explore</h2>
                <ul className="mt-4 space-y-3 text-sm text-muted">
                  <li><Link className="inline-flex items-center rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand/30 hover:bg-brand/5 hover:text-brand" href="/">Home</Link></li>
                  <li><Link className="inline-flex items-center rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand/30 hover:bg-brand/5 hover:text-brand" href="/menu">Browse Menu</Link></li>
                  <li><Link className="inline-flex items-center rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand/30 hover:bg-brand/5 hover:text-brand" href="/favorites">Favorites</Link></li>
                  <li><Link className="inline-flex items-center rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand/30 hover:bg-brand/5 hover:text-brand" href="/cart">Shopping Cart</Link></li>
                </ul>
              </div>

              <div>
                <h2 className="font-semibold text-foreground">Your Account</h2>
                <ul className="mt-4 space-y-3 text-sm text-muted">
                  {session ? (
                    <>
                      {session.role !== "staff" && (
                        <li><Link className="inline-flex items-center rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand/30 hover:bg-brand/5 hover:text-brand" href="/orders">My Orders</Link></li>
                      )}
                      <li><span>Signed in as {session.name}</span></li>
                    </>
                  ) : (
                    <>
                      <li><Link className="inline-flex items-center rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand/30 hover:bg-brand/5 hover:text-brand" href="/signin">Sign In</Link></li>
                      <li><Link className="inline-flex items-center rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand/30 hover:bg-brand/5 hover:text-brand" href="/signup">Create Account</Link></li>
                    </>
                  )}
                </ul>
              </div>

              <div>
                <h2 className="font-semibold text-foreground">Staff</h2>
                <ul className="mt-4 space-y-3 text-sm text-muted">
                  <li>
                    <Link
                      href="/admin"
                      className="inline-flex items-center rounded-lg border border-brand/20 bg-brand/5 px-3 py-2 text-sm font-semibold text-brand transition-colors hover:border-brand/40 hover:bg-brand/10 hover:text-brand-hover"
                    >
                      Admin Panel
                    </Link>
                  </li>
                  <li className="leading-6">
                    Authorized staff can manage orders, kitchen activity, and analytics.
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-border bg-background">
              <div className="mx-auto flex max-w-screen-2xl flex-col gap-2 px-6 py-6 sm:px-10 lg:px-12 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
                <p>© {new Date().getFullYear()} Addis Eats. All rights reserved.</p>
                <p>Made for food lovers in Addis Ababa.</p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}





