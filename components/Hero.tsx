import { Radio } from "lucide-react";

export default function Hero() {
  return (
    <div className="mb-10">
      <div className="mb-5 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-signal-green">
        <Radio className="h-3.5 w-3.5" />
        Live verification — three-stage check
      </div>
      <h1 className="max-w-xl font-display text-[34px] font-semibold leading-[1.15] tracking-tight text-primary sm:text-[42px]">
        Every wire, verified before it leaves.
      </h1>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
        CrossGuard checks vendor identity, transaction history, and banking
        details against your registry — in milliseconds, before payment
        clears.
      </p>

      <div className="mt-8 grid max-w-md grid-cols-3 gap-3 font-mono text-[11px]">
        {[
          { n: "01", label: "Verify paperwork" },
          { n: "02", label: "Check history" },
          { n: "03", label: "Intercept risk" },
        ].map((s) => (
          <div key={s.n} className="rounded-md border border-hairline bg-surface px-3 py-3">
            <div className="text-accent">{s.n}</div>
            <div className="mt-1.5 font-body text-[11.5px] leading-snug text-muted">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
