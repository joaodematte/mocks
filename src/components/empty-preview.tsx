export function EmptyPreview() {
  return (
    <div className="text-muted-foreground bg-muted flex h-full w-full flex-col items-center justify-center rounded-md border px-8 text-center font-mono">
      <p className="mb-1 font-medium">No mock data generated yet</p>
      <p className="text-sm">
        Fill out the form on the left and click &quot;Generate Mock API&quot; to create your mock data and API endpoint
      </p>
    </div>
  );
}
