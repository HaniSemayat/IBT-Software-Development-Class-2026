import Link from "next/link";
import SignOutButton from "../components/SignOutButton";

export default function UserMenu({ session }) {
  if (!session) {
    return (
      <Link
        href="/signin"
        className="inline-flex min-h-10 items-center justify-center rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      >
        Sign In
      </Link>
    );
  }

  const initial = session.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <div className="flex items-center gap-3">
      <div
        aria-label={`Signed in as ${session.name}`}
        title={session.name}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 font-bold text-brand ring-1 ring-brand/15"
      >
        {initial}
      </div>

      <div className="hidden min-w-0 text-left xl:block">
        <p className="max-w-32 truncate text-sm font-semibold text-foreground">
          {session.name}
        </p>
        <p className="max-w-32 truncate text-xs text-muted">
          {session.email}
        </p>
      </div>

      <div className="hidden lg:block">
        <SignOutButton className="min-h-10 cursor-pointer rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2" />
      </div>
    </div>
  );
}

