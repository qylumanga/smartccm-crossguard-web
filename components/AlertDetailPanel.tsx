"use client";

import { X, TriangleAlert, ShieldCheck, ArrowRight } from "lucide-react";
import { Invoice } from "@/lib/types";
import StatusIndicator from "./StatusIndicator";

export default function AlertDetailPanel({
  invoice,
  onClose,
}: {
  invoice: Invoice;
  onClose: () => void;
}) {
  const isRed = invoice.status === "red";
  const isGreen = invoice.status === "green";

  const badgeColor = isRed ? "text-signal-red" : isGreen ? "text-signal-green" : "text-signal-amber";
  const badgeLabel = isRed ? "Critical alert" : isGreen ? "Verified" : "Needs review";
  const title = isRed
    ? "Potential invoice hijacking detected"
    : isGreen
    ? "Verified — cleared for payment"
    : "Details don't fully match on record";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/60 backdrop-blur-sm">
      <div className="h-full w-full max-w-md animate-[slideIn_0.25s_ease-out] overflow-y-auto border-l border-hairline bg-surface p-6 shadow-panel">
        <div className="mb-5 flex items-start justify-between">
          <div className="flex items-center gap-2">
            {isRed ? (
              <TriangleAlert className="h-[18px] w-[18px] text-signal-red" />
            ) : (
              <ShieldCheck className={`h-[18px] w-[18px] ${badgeColor}`} />
            )}
            <span className={`text-[11px] font-medium uppercase tracking-wide ${badgeColor}`}>
              {badgeLabel}
            </span>
          </div>
          <button onClick={onClose} className="text-muted transition-colors hover:text-primary">
            <X className="h-4 w-4" />
          </button>
        </div>

        <h3 className="font-display text-[19px] font-semibold leading-snug text-primary">
          {title}
        </h3>
        <p className="mt-1.5 text-[13px] text-muted">{invoice.vendorName}</p>

        <div className="mt-2">
          <StatusIndicator status={invoice.status} />
        </div>

        {invoice.reasons.length === 0 && (
          <p className="mt-6 rounded-lg border border-hairline bg-ink p-4 text-[13px] leading-relaxed text-muted">
            Bank country, routing number, and sender domain all match the
            registry on file. No discrepancies found.
          </p>
        )}

        <div className="mt-6 space-y-3">
          {invoice.reasons.map((r) => (
            <div key={r.field} className="rounded-lg border border-hairline bg-ink p-4">
              <div className="mb-3 text-[11.5px] font-medium text-primary">{r.label}</div>
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase tracking-wide text-muted">
                    On record
                  </div>
                  <div className="mt-1 truncate font-mono text-[12px] text-signal-green">
                    {r.expected}
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-muted" />
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase tracking-wide text-muted">
                    Submitted
                  </div>
                  <div className="mt-1 truncate font-mono text-[12px] text-signal-red">
                    {r.submitted}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg border border-hairline bg-ink p-4">
          <div className="text-[10px] uppercase tracking-wide text-muted">
            Recommended action
          </div>
          <div className="mt-1.5 text-[13.5px] font-medium text-primary">
            {invoice.recommendedAction}
          </div>
        </div>

        {isRed && (
          <button
            onClick={onClose}
            className="mt-5 w-full rounded-md bg-signal-red py-2.5 text-[13.5px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Cancel payment
          </button>
        )}
      </div>
    </div>
  );
}
