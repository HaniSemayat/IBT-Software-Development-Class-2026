import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Addis Eats",
  description: "Discover delicious food in Addis Ababa.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <header className="border-b p-4">
          <nav className="flex gap-4">
            <Link href="/">Addis Eats</Link>
            <Link href="/menu">Menu</Link>
            <Link href="/cart">Cart</Link>
            <Link href="/checkout">Checkout</Link>
          </nav>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="border-t p-4 text-center">
          <p>© 2026 Addis Eats</p>
        </footer>
      </body>
    </html>
  );
}