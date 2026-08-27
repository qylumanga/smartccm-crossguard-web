import { Vendor } from "./types";

// This file simulates a vendor registry lookup.
// In production this data would come from a GET /api/vendors call
// backed by the Vendor table described in the SDD.
export const mockVendors: Vendor[] = [
  {
    id: "v1",
    name: "ACME Industrial Manufacturing",
    country: "Germany",
    knownBankCountry: "Germany",
    knownRoutingNumber: "DE89-3704-0044-0532-0130-00",
    knownEmailDomain: "acme-industrial.de",
    taxId: "DE812345678",
  },
  {
    id: "v2",
    name: "Namib Freight Logistics",
    country: "Namibia",
    knownBankCountry: "Namibia",
    knownRoutingNumber: "NA76-8801-2200-1123-4455",
    knownEmailDomain: "namibfreight.na",
    taxId: "NA5567890",
  },
  {
    id: "v3",
    name: "Silverline Components Ltd",
    country: "United Kingdom",
    knownBankCountry: "United Kingdom",
    knownRoutingNumber: "GB29-NWBK-6016-1331-9268-19",
    knownEmailDomain: "silverline-components.co.uk",
    taxId: "GB334455667",
  },
  {
    id: "v4",
    name: "Pinnacle Steel Trading",
    country: "South Africa",
    knownBankCountry: "South Africa",
    knownRoutingNumber: "ZA45-2200-1188-7766",
    knownEmailDomain: "pinnaclesteel.co.za",
    taxId: "ZA9988776",
  },
  {
    id: "v5",
    name: "Meridian Textiles Co",
    country: "Portugal",
    knownBankCountry: "Portugal",
    knownRoutingNumber: "PT50-0002-0123-1234-5678-901-54",
    knownEmailDomain: "meridiantextiles.pt",
    taxId: "PT223344556",
  },
  {
    id: "v6",
    name: "Coastal Marine Parts",
    country: "Kenya",
    knownBankCountry: "Kenya",
    knownRoutingNumber: "KE12-4400-9911-2233",
    knownEmailDomain: "coastalmarine.ke",
    taxId: "KE1122334",
  },
];
