import type { StatementCategory } from "@/backend/statements/categories";

export type StatementTransaction = {
  row_number: number;
  transaction_date: string;
  original_description: string;
  bank_category: string;
  money_in: number | null;
  money_out: number | null;
  fee: number | null;
  amount: number;
  mapped_category: StatementCategory;
};
