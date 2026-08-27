"use client";

import { useRef, useState } from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

export default function UploadPanel({
  onVerify,
  verifying,
}: {
  onVerify: (fileCount: number) => void;
  verifying: boolean;
}) {
  const [files, setFiles] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(list: FileList | null) {
    if (!list) return;
    const names = Array.from(list)
      .slice(0, 10)
      .map((f) => f.name);
    setFiles(names);
  }

  function removeFile(name: string) {
    setFiles((prev) => prev.filter((f) => f !== name));
  }

  return (
    <div className="rounded-xl border border-hairline bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-[15px] font-semibold text-primary">
          Upload invoice batch
        </h2>
        <span className="font-mono text-[11px] text-muted">
          {files.length}/10
        </span>
      </div>

      <button
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-hairline py-8 text-center transition-colors hover:border-accent/50"
      >
        <UploadCloud className="h-5 w-5 text-muted" />
        <span className="text-[13px] text-muted">
          Drop PDFs here or{" "}
          <span className="text-accent">browse files</span>
        </span>
        <span className="text-[11px] text-muted/70">up to 10 invoices</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {files.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {files.map((name) => (
            <li
              key={name}
              className="flex items-center justify-between rounded-md border border-hairline bg-ink px-3 py-2 text-[12.5px] text-primary"
            >
              <span className="flex items-center gap-2 truncate">
                <FileText className="h-3.5 w-3.5 flex-shrink-0 text-muted" />
                <span className="truncate">{name}</span>
              </span>
              <button
                onClick={() => removeFile(name)}
                className="text-muted transition-colors hover:text-signal-red"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => onVerify(files.length || 10)}
        disabled={verifying}
        className="mt-4 flex w-full items-center justify-center rounded-md bg-accent py-2.5 text-[13.5px] font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {verifying ? (
          <LoadingSpinner label="Verifying against registry…" />
        ) : (
          `Run verification${files.length ? ` on ${files.length}` : " — sample batch"}`
        )}
      </button>
    </div>
  );
}
