import type { AppCategory } from "@/backend/statements/categories";
import type { StatementTransaction } from "@/backend/statements/statement-transaction";

export type CategoryChartDatum = {
  category: AppCategory;
  total: number;
};

const EXCLUDED_EXPENSE_CATEGORIES: AppCategory[] = ["Transfer"];

export function buildCategoryChartData(
  transactions: StatementTransaction[]
): CategoryChartDatum[] {
  const totals = new Map<AppCategory, number>();

  for (const transaction of transactions) {
    if (transaction.mapped_category === "Interest") {
      continue;
    }

    if (EXCLUDED_EXPENSE_CATEGORIES.includes(transaction.mapped_category)) {
      continue;
    }

    if (transaction.amount >= 0) {
      continue;
    }

    const currentTotal = totals.get(transaction.mapped_category) ?? 0;
    totals.set(transaction.mapped_category, currentTotal + Math.abs(transaction.amount));
  }

  return Array.from(totals.entries())
    .map(([category, total]) => ({
      category,
      total,
    }))
    .toSorted((left, right) => right.total - left.total);
}
