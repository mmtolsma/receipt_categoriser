export type ReceiptProcessingResult = {
  merchant_name: string;
  transaction_date: string;
  transaction_time: string;
  currency: string;
  subtotal: number;
  tax: number;
  total: number;
  receipt_items: Array<{
    line_number: number;
    raw_label: string;
    normalized_label: string;
    quantity: number;
    unit_cost: number;
    line_total: number;
    category: string;
    confidence: number;
  }>;
  confidence: number;
  warnings: string[];
};

export async function processReceipt(): Promise<ReceiptProcessingResult> {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });

  return {
    merchant_name: "Woolworths",
    transaction_date: "2026-08-04",
    transaction_time: "14:32",
    currency: "ZAR",
    subtotal: 123.45,
    tax: 16.1,
    total: 139.55,
    receipt_items: [
      {
        line_number: 1,
        raw_label: "MILK 2L",
        normalized_label: "Milk 2L",
        quantity: 1,
        unit_cost: 34.99,
        line_total: 34.99,
        category: "groceries",
        confidence: 0.94,
      },
    ],
    confidence: 0.9,
    warnings: [],
  };
}
