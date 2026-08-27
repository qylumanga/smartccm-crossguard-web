"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, AlertCircle } from "lucide-react";
import { login } from "@/lib/store";
import LoadingSpinner from "./LoadingSpinner";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("treasury@smartccm.dev");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    await new Promise((r) => setTimeout(r, 900));

    const ok = login(email, password);
    setLoading(false);

    if (!ok) {
      setError("Those credentials don't match our records. Check the demo credentials below and try again.");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-hairline bg-surface p-6 shadow-panel">
      <div className="mb-5 flex items-center gap-2">
        <KeyRound className="h-4 w-4 text-accent" />
        <h2 className="font-display text-[15px] font-semibold text-primary">
          Treasury sign-in
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="mb-1.5 block text-[11px] font-medium text-muted">
            Work email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-hairline bg-ink px-3 py-2.5 text-[13.5px] text-primary outline-none transition-colors focus:border-accent"
            placeholder="you@company.com"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-medium text-muted">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-hairline bg-ink px-3 py-2.5 text-[13.5px] text-primary outline-none transition-colors focus:border-accent"
            placeholder="••••••••••••"
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-md border border-signal-red/30 bg-signal-red/10 px-3 py-2.5 text-[12.5px] text-signal-red">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-md bg-accent py-2.5 text-[13.5px] font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? <LoadingSpinner label="Signing in…" /> : "Sign in"}
        </button>
      </form>

      <p className="mt-4 border-t border-hairline pt-3.5 font-mono text-[11px] leading-relaxed text-muted">
        demo: treasury@smartccm.dev / crossguard-demo
      </p>
    </div>
  );
}
