"use client";

import { CheckCircle2, X } from "lucide-react";

export default function SuccessModal({
  summary,
  onClose,
}: {
  summary: { green: number; yellow: number; red: number };
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 px-5 backdrop-blur-sm">
      <div className="w-full max-w-sm animate-[fadeIn_0.2s_ease-out] rounded-xl border border-hairline bg-surface p-6 shadow-panel">
        <button
          onClick={onClose}
          className="float-right text-muted transition-colors hover:text-primary"
        >
          <X className="h-4 w-4" />
        </button>
        <CheckCircle2 className="h-6 w-6 text-signal-green" />
        <h3 className="mt-3 font-display text-[16px] font-semibold text-primary">
          Batch verified
        </h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
          {summary.green + summary.yellow + summary.red} invoices processed
          against the vendor registry.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-[13px]">
          <div className="rounded-md border border-hairline py-2 text-center">
            <div className="text-signal-green">{summary.green}</div>
            <div className="mt-0.5 text-[10px] text-muted">cleared</div>
          </div>
          <div className="rounded-md border border-hairline py-2 text-center">
            <div className="text-signal-amber">{summary.yellow}</div>
            <div className="mt-0.5 text-[10px] text-muted">review</div>
          </div>
          <div className="rounded-md border border-hairline py-2 text-center">
            <div className="text-signal-red">{summary.red}</div>
            <div className="mt-0.5 text-[10px] text-muted">blocked</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-5 w-full rounded-md bg-accent py-2.5 text-[13.5px] font-medium text-ink transition-opacity hover:opacity-90"
        >
          View results
        </button>
      </div>
    </div>
  );
}
