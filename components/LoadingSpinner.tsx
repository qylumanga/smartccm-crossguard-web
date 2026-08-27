export default function LoadingSpinner({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-3.5 w-3.5 animate-spin rounded-full border-[2px] border-ink/30 border-t-ink" />
      {label && <span>{label}</span>}
    </span>
  );
}
