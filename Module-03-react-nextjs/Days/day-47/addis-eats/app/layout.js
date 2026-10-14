import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import Providers from "./Providers";
import UserMenu from "./UserMenu";
import CartNavLink from "../components/CartNavLink";
import FavoritesNavLink from "../components/FavoritesNavLink";
import { getSession } from "../lib/session";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
  "whitespace-nowrap text-sm font-medium text-gray-700 transition hover:text-orange-600";

export default async function RootLayout({ children }) {
  const session = await getSession();
  const isStaff = session?.role === "staff";

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <Providers>
          <header className="border-b bg-white">
            <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
              <Link href="/" className="text-xl font-bold text-orange-600">
                Addis Eats
              </Link>

              <div className="flex flex-wrap items-center gap-4">
                {isStaff ? (
                  <>
                    <Link href="/admin" className={linkClass}>
                      Admin Panel
                    </Link>
                    <Link href="/dashboard" className={linkClass}>
                      Dashboard
                    </Link>
                    <Link href="/admin/orders" className={linkClass}>
                      All Orders
                    </Link>
                    <Link href="/kitchen" className={linkClass}>
                      Kitchen
                    </Link>
                    <Link href="/menu" className={linkClass}>
                      Customer Menu
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/" className={linkClass}>Home</Link>
                    <Link href="/menu" className={linkClass}>Menu</Link>
                    <FavoritesNavLink />
                    <CartNavLink />
                    <Link href="/checkout" className={linkClass}>Checkout</Link>
                    {session && (
                      <Link href="/orders" className={linkClass}>
                        My Orders
                      </Link>
                    )}
                  </>
                )}

                <UserMenu session={session} />
              </div>
            </nav>
          </header>

          <main className="min-h-[calc(100vh-137px)]">{children}</main>

          <footer className="mt-16 border-t bg-white">
            <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <Link href="/" className="text-xl font-bold text-orange-600">
                  Addis Eats
                </Link>
                <p className="mt-3 max-w-xs text-sm leading-6 text-gray-600">
                  Discover Ethiopian favorites, order fresh meals, and enjoy
                  great food delivered with care.
                </p>
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">Explore</h2>
                <ul className="mt-4 space-y-3 text-sm text-gray-600">
                  <li><Link className="hover:text-orange-600" href="/">Home</Link></li>
                  <li><Link className="hover:text-orange-600" href="/menu">Browse Menu</Link></li>
                  <li><Link className="hover:text-orange-600" href="/favorites">Favorites</Link></li>
                  <li><Link className="hover:text-orange-600" href="/cart">Shopping Cart</Link></li>
                </ul>
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">Your Account</h2>
                <ul className="mt-4 space-y-3 text-sm text-gray-600">
                  {session ? (
                    <>
                      {session.role !== "staff" && (
                        <li><Link className="hover:text-orange-600" href="/orders">My Orders</Link></li>
                      )}
                      <li><span>Signed in as {session.name}</span></li>
                    </>
                  ) : (
                    <>
                      <li><Link className="hover:text-orange-600" href="/signin">Sign In</Link></li>
                      <li><Link className="hover:text-orange-600" href="/signup">Create Account</Link></li>
                    </>
                  )}
                </ul>
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">Staff</h2>
                <ul className="mt-4 space-y-3 text-sm text-gray-600">
                  <li>
                    <Link
                      href="/admin"
                      className="font-semibold text-orange-600 hover:text-orange-700"
                    >
                      Admin Panel →
                    </Link>
                  </li>
                  <li className="leading-6">
                    Authorized staff can manage orders, kitchen activity, and analytics.
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t bg-gray-50">
              <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-5 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
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

