import Link from "next/link";
import SignUpForm from "./SignUpForm";

export const metadata = {
  title: "Create Account",
  description: "Create your Addis Eats customer account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignUpPage() {
  return (
    <main className="mx-auto min-h-[60vh] max-w-md px-5 py-12 sm:px-8 sm:py-16">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">
          Addis Eats
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Create Account
        </h1>

        <p className="mt-3 leading-7 text-muted">
          Join Addis Eats and order your favorite dishes.
        </p>
      </div>

      <section className="mt-8 rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-8">
        <SignUpForm />

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-semibold text-brand transition-colors hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
