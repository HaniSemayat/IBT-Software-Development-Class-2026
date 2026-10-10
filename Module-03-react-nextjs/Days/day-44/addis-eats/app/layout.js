import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Providers from "./Providers";
import UserMenu from "./UserMenu";
import { getSession } from "../lib/session";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
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

export default async function RootLayout({ children }) {
  const session = await getSession();

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b bg-white">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link
              href="/"
              className="text-xl font-bold text-orange-600"
            >
              Addis Eats
            </Link>

            <div className="flex items-center gap-6 text-sm font-medium">
              <Link
                href="/"
                className="text-gray-800 transition hover:text-orange-600"
              >
                Home
              </Link>

              <Link
                href="/menu"
                className="text-gray-800 transition hover:text-orange-600"
              >
                Menu
              </Link>

              <Link
                href="/cart"
                className="text-gray-800 transition hover:text-orange-600"
              >
                Cart
              </Link>

              <Link
                href="/checkout"
                className="text-gray-800 transition hover:text-orange-600"
              >
                Checkout
              </Link>

              <UserMenu session={session} />
            </div>
          </nav>
        </header>

        <main className="min-h-[calc(100vh-137px)]">
          <Providers>{children}</Providers>
        </main>

        <footer className="border-t bg-white">
          <div className="mx-auto max-w-6xl px-6 py-6 text-center text-sm text-gray-500">
            Copyright 2026 Addis Eats
          </div>
        </footer>
      </body>
    </html>
  );
}
