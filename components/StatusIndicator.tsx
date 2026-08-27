import { InvoiceStatus } from "@/lib/types";

const config: Record<InvoiceStatus, { color: string; bg: string; label: string; pulse?: boolean }> = {
  green: { color: "text-signal-green", bg: "bg-signal-green", label: "Cleared" },
  yellow: { color: "text-signal-amber", bg: "bg-signal-amber", label: "Review" },
  red: { color: "text-signal-red", bg: "bg-signal-red", label: "Blocked", pulse: true },
};

export default function StatusIndicator({ status }: { status: InvoiceStatus }) {
  const c = config[status];
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-2 w-2 rounded-full ${c.bg} ${c.pulse ? "signal-pulse-red" : ""}`}
      />
      <span className={`text-[12px] font-medium ${c.color}`}>{c.label}</span>
    </div>
  );
}

export function SignalBar({ status }: { status: InvoiceStatus }) {
  const c = config[status];
  return <span className={`absolute inset-y-0 left-0 w-[3px] ${c.bg}`} />;
}
