"use client";

import { ShieldCheck, LogOut } from "lucide-react";

export default function Navbar({
  authed,
  onLogout,
}: {
  authed?: boolean;
  onLogout?: () => void;
}) {
  return (
    <nav className="sticky top-0 z-40 border-b border-hairline bg-ink/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 text-accent" strokeWidth={2.25} />
          <span className="font-display text-[15px] font-semibold tracking-tight text-primary">
            CrossGuard
          </span>
        </div>
        {authed && (
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 rounded-md border border-hairline px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-signal-red/40 hover:text-signal-red"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        )}
      </div>
    </nav>
  );
}
