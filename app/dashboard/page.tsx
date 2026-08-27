"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import UploadPanel from "@/components/UploadPanel";
import InvoiceTable from "@/components/InvoiceTable";
import AlertDetailPanel from "@/components/AlertDetailPanel";
import SuccessModal from "@/components/SuccessModal";
import { Invoice } from "@/lib/types";
import { getInvoices, runBatchVerification, isAuthed, logout } from "@/lib/store";

export default function DashboardPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [verifying, setVerifying] = useState(false);
  const [selected, setSelected] = useState<Invoice | null>(null);
  const [summary, setSummary] = useState<{ green: number; yellow: number; red: number } | null>(
    null
  );

  useEffect(() => {
    if (!isAuthed()) {
      router.replace("/");
      return;
    }
    setInvoices(getInvoices());
    setReady(true);
  }, [router]);

  async function handleVerify(fileCount: number) {
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 1500));
    const results = runBatchVerification(fileCount);
    setInvoices(results);
    setSummary({
      green: results.filter((i) => i.status === "green").length,
      yellow: results.filter((i) => i.status === "yellow").length,
      red: results.filter((i) => i.status === "red").length,
    });
    setVerifying(false);
  }

  function handleLogout() {
    logout();
    router.replace("/");
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink">
        <span className="h-5 w-5 animate-spin rounded-full border-[2px] border-hairline border-t-accent" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ink">
      <Navbar authed onLogout={handleLogout} />
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="mb-8">
          <h1 className="font-display text-[24px] font-semibold text-primary">
            Verification queue
          </h1>
          <p className="mt-1 text-[13.5px] text-muted">
            Upload a batch of invoices to check them against the vendor registry.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <UploadPanel onVerify={handleVerify} verifying={verifying} />
          <InvoiceTable invoices={invoices} onSelect={setSelected} />
        </div>
      </div>

      {selected && (
        <AlertDetailPanel invoice={selected} onClose={() => setSelected(null)} />
      )}
      {summary && (
        <SuccessModal summary={summary} onClose={() => setSummary(null)} />
      )}
    </main>
  );
}
