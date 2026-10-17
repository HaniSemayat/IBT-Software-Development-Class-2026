export default function DashboardLoading() {
  return (
    <main
      className="mx-auto max-w-7xl space-y-8 px-6 py-10"
      aria-busy="true"
      aria-label="Loading analytics dashboard"
    >
      <div className="h-9 w-72 animate-pulse rounded bg-gray-200" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-24 animate-pulse rounded-xl bg-gray-200" />
        <div className="h-24 animate-pulse rounded-xl bg-gray-200" />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-[34rem] animate-pulse rounded-xl bg-gray-200" />
        <div className="h-[34rem] animate-pulse rounded-xl bg-gray-200" />
      </div>
    </main>
  );
}
