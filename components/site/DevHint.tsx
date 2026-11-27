/**
 * Visible only in development: marks where confirmed business details will
 * appear once they are added to lib/store.ts. Renders nothing in production.
 */
export function DevHint({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "production") return null;
  return (
    <p className="rounded-sm border border-dashed border-amber-deep/50 px-3 py-2 text-2xs text-amber-deep" data-dev-hint>
      {children}
    </p>
  );
}
