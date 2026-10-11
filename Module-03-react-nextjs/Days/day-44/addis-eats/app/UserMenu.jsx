import Link from "next/link";
import { signOut } from "./actions";

export default function UserMenu({ session }) {
  if (!session) {
    return (
      <Link
        href="/signin"
        className="rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white transition hover:bg-orange-700"
      >
        Sign In
      </Link>
    );
  }

  const initial = session.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-700">
          {initial}
        </div>

        <div className="hidden text-left sm:block">
          <p className="text-sm font-semibold text-gray-900">
            {session.name}
          </p>

          <p className="text-xs text-gray-500">
            {session.email}
          </p>
        </div>
      </div>

      <form action={signOut}>
        <button
          type="submit"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-orange-500 hover:text-orange-600"
        >
          Sign Out
        </button>
      </form>
    </div>
  );
}
