import { Invoice } from "./types";
import { mockVendors } from "./mockVendors";
import { sampleExtractedBatch } from "./sampleBatch";
import { evaluateInvoice } from "./ruleEngine";

// Simulates a persistence layer. In production this reads/writes via
// Next.js Route Handlers backed by Postgres (see SDD Data Model).
// Isolated here so swapping to real fetch() calls only touches this file.
const STORAGE_KEY = "crossguard:invoices";
const AUTH_KEY = "crossguard:session";

export function getInvoices(): Invoice[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Invoice[]) : [];
  } catch {
    return [];
  }
}

function saveInvoices(invoices: Invoice[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
}

export function clearInvoices() {
  window.localStorage.removeItem(STORAGE_KEY);
}

// Simulates: upload -> PDF extraction -> rule engine -> persisted result.
// `fileCount` stands in for the number of PDFs a user dropped in the
// upload zone; each maps to a scenario in the sample batch pool.
export function runBatchVerification(fileCount: number): Invoice[] {
  const count = Math.min(fileCount, sampleExtractedBatch.length, 10);
  const now = new Date().toISOString();

  const results: Invoice[] = sampleExtractedBatch.slice(0, count).map((extracted, i) => {
    const evaluation = evaluateInvoice(extracted, mockVendors);
    return {
      id: `inv_${Date.now()}_${i}`,
      vendorName: extracted.vendorName,
      vendorId: evaluation.vendorId,
      amount: extracted.amount,
      currency: extracted.currency,
      extractedBankCountry: extracted.extractedBankCountry,
      extractedRoutingNumber: extracted.extractedRoutingNumber,
      extractedEmailDomain: extracted.extractedEmailDomain,
      extractionStatus: extracted.extractionStatus,
      status: evaluation.status,
      reasons: evaluation.reasons,
      recommendedAction: evaluation.recommendedAction,
      createdAt: now,
    };
  });

  saveInvoices(results);
  return results;
}

// --- Simulated auth (seeded credentials per SDD v1 scope) ---
export function login(email: string, password: string): boolean {
  const ok = email.trim().toLowerCase() === "treasury@smartccm.dev" && password === "crossguard-demo";
  if (ok && typeof window !== "undefined") {
    window.localStorage.setItem(AUTH_KEY, "1");
  }
  return ok;
}

export function isAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(AUTH_KEY) === "1";
}

export function logout() {
  window.localStorage.removeItem(AUTH_KEY);
}
