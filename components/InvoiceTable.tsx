"use client";

import { Inbox } from "lucide-react";
import { Invoice } from "@/lib/types";
import StatusIndicator, { SignalBar } from "./StatusIndicator";

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

export default function InvoiceTable({
  invoices,
  onSelect,
}: {
  invoices: Invoice[];
  onSelect: (invoice: Invoice) => void;
}) {
  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-hairline bg-surface py-16 text-center">
        <Inbox className="h-6 w-6 text-muted" />
        <p className="mt-3 text-[13.5px] text-muted">
          No batch verified yet. Upload invoices to see results here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-hairline bg-surface">
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-hairline px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-muted">
        <span>Vendor</span>
        <span>Amount</span>
        <span>Bank country</span>
        <span>Status</span>
      </div>
      <div>
        {invoices.map((inv) => (
          <button
            key={inv.id}
            onClick={() => onSelect(inv)}
            className="relative grid w-full grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-hairline px-5 py-3.5 pl-6 text-left transition-colors last:border-b-0 hover:bg-surface-raised"
          >
            <SignalBar status={inv.status} />
            <span className="truncate text-[13.5px] text-primary">{inv.vendorName}</span>
            <span className="font-mono text-[12.5px] text-primary">
              {formatAmount(inv.amount, inv.currency)}
            </span>
            <span className="text-[12.5px] text-muted">{inv.extractedBankCountry}</span>
            <StatusIndicator status={inv.status} />
          </button>
        ))}
      </div>
    </div>
  );
}
