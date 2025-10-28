import crypto from "crypto";

/**
 * Generates a unique and readable invoice ID.
 * Example output: INV-20251028-3F7C9A
 */
export const generateInvoiceId = (): string => {
  const date = new Date();
  const datePart = date
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, ""); // e.g. 20251028
  const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase(); // 6 chars
  return `INV-${datePart}-${randomPart}`;
};
