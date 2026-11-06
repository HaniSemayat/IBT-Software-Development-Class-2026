export default function DashboardLoading() {
  return (
    <main
      className="mx-auto max-w-7xl space-y-8 px-6 py-10"
      aria-busy="true"
      aria-label="Loading analytics dashboard"
    >
      <div className="h-9 w-72 animate-pulse rounded-lg bg-brand/10" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-2xl border border-border bg-surface" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-[34rem] animate-pulse rounded-2xl border border-border bg-surface" />
        <div className="h-[34rem] animate-pulse rounded-2xl border border-border bg-surface" />
        <div className="h-[34rem] animate-pulse rounded-2xl border border-border bg-surface" />
      </div>
    </main>
  );
}
