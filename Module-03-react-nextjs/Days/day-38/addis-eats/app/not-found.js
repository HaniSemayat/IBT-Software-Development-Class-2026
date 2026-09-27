import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, we could not find what you are looking for.</p>

      <Link href="/menu">Back to Menu</Link>
    </main>
  );
}