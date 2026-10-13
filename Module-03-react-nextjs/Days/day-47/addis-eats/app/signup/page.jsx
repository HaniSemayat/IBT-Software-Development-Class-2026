
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
    <main className="mx-auto max-w-md px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
        Addis Eats
      </p>

      <h1 className="mt-2 text-4xl font-bold tracking-tight">
        Create account
      </h1>

      <p className="mt-3 text-gray-600">
        Create your account to order your favorite dishes.
      </p>

      <div className="mt-8">
        <SignUpForm />
      </div>

      <p className="mt-6 text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="font-semibold text-orange-600 hover:text-orange-700"
        >
          Sign in
        </Link>
      </p>
    </main>
  );
}
