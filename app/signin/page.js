import Link from "next/link";
import SignInForm from "./SignInForm";

export const metadata = {
  title: "Sign In",
  description: "Sign in to your Addis Eats account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SignInPage({ searchParams }) {
  const params = await searchParams;
  const next = params.next ?? "/";

  return (
    <main className="mx-auto min-h-[60vh] max-w-md px-5 py-12 sm:px-8 sm:py-16">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">
          Addis Eats
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Welcome Back
        </h1>

        <p className="mt-3 leading-7 text-muted">
          Sign in to continue to your Addis Eats account.
        </p>
      </div>

      <div className="mt-8 rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-8">
        <SignInForm next={next} />

        <p className="mt-6 text-center text-sm text-muted">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-brand transition-colors hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}