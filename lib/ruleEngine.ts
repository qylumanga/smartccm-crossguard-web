import { Invoice, MismatchReason, Vendor } from "./types";

interface ExtractedInvoice {
  vendorName: string;
  amount: number;
  currency: string;
  extractedBankCountry: string;
  extractedRoutingNumber: string;
  extractedEmailDomain: string;
  extractionStatus: "complete" | "incomplete";
}

// Mirrors the v1 rule engine described in the SDD:
// 1. Vendor match  2. Bank country  3. Routing number  4. Sender domain.
// This is intentionally deterministic and explainable — every status
// traces back to a specific field, stored as `reasons`.
export function evaluateInvoice(
  extracted: ExtractedInvoice,
  vendors: Vendor[]
): Pick<Invoice, "vendorId" | "status" | "reasons" | "recommendedAction"> {
  if (extracted.extractionStatus === "incomplete") {
    return {
      vendorId: null,
      status: "yellow",
      reasons: [
        {
          field: "vendorMatch",
          label: "Extraction incomplete",
          expected: "All fields present",
          submitted: "One or more fields could not be read from the document",
        },
      ],
      recommendedAction: "Manual review — verify document quality and re-upload if needed",
    };
  }

  const vendor = vendors.find(
    (v) => v.name.toLowerCase() === extracted.vendorName.toLowerCase()
  );

  if (!vendor) {
    return {
      vendorId: null,
      status: "red",
      reasons: [
        {
          field: "vendorMatch",
          label: "Unknown vendor",
          expected: "A vendor on record",
          submitted: extracted.vendorName,
        },
      ],
      recommendedAction: "Cancel payment — vendor not found in registry",
    };
  }

  const reasons: MismatchReason[] = [];

  const bankCountryMismatch = vendor.knownBankCountry !== extracted.extractedBankCountry;
  if (bankCountryMismatch) {
    reasons.push({
      field: "bankCountry",
      label: "Bank country mismatch",
      expected: vendor.knownBankCountry,
      submitted: extracted.extractedBankCountry,
    });
  }

  const domainMismatch = vendor.knownEmailDomain !== extracted.extractedEmailDomain;
  if (domainMismatch) {
    reasons.push({
      field: "emailDomain",
      label: "Sender domain mismatch",
      expected: vendor.knownEmailDomain,
      submitted: extracted.extractedEmailDomain,
    });
  }

  const routingMismatch = vendor.knownRoutingNumber !== extracted.extractedRoutingNumber;
  if (routingMismatch) {
    reasons.push({
      field: "routingNumber",
      label: "Routing/SWIFT number changed",
      expected: vendor.knownRoutingNumber,
      submitted: extracted.extractedRoutingNumber,
    });
  }

  if (bankCountryMismatch && domainMismatch) {
    return {
      vendorId: vendor.id,
      status: "red",
      reasons,
      recommendedAction: "Cancel payment — classic invoice hijacking pattern detected",
    };
  }

  if (reasons.length > 0) {
    return {
      vendorId: vendor.id,
      status: "yellow",
      reasons,
      recommendedAction: "Hold and confirm with vendor via a known contact before releasing payment",
    };
  }

  return {
    vendorId: vendor.id,
    status: "green",
    reasons: [],
    recommendedAction: "Cleared for payment",
  };
}
