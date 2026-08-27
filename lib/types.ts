export type InvoiceStatus = "green" | "yellow" | "red";

export interface Vendor {
  id: string;
  name: string;
  country: string;
  knownBankCountry: string;
  knownRoutingNumber: string;
  knownEmailDomain: string;
  taxId: string;
}

export interface MismatchReason {
  field: "bankCountry" | "routingNumber" | "emailDomain" | "vendorMatch";
  label: string;
  expected: string;
  submitted: string;
}

export interface Invoice {
  id: string;
  vendorName: string;
  vendorId: string | null;
  amount: number;
  currency: string;
  extractedBankCountry: string;
  extractedRoutingNumber: string;
  extractedEmailDomain: string;
  extractionStatus: "complete" | "incomplete";
  status: InvoiceStatus;
  reasons: MismatchReason[];
  recommendedAction: string;
  createdAt: string;
}
