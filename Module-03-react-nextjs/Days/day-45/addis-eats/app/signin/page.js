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
    <main className="mx-auto max-w-md px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
        Addis Eats
      </p>

      <h1 className="mt-2 text-4xl font-bold tracking-tight">
        Sign in
      </h1>

      <p className="mt-3 text-gray-600">
        Sign in to continue to your Addis Eats account.
      </p>

      <div className="mt-8">
        <SignInForm next={next} />
      </div>

      <p className="mt-6 text-sm text-gray-600">
        Do not have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-orange-600 hover:text-orange-700"
        >
          Create account
        </Link>
      </p>
    </main>
  );
}