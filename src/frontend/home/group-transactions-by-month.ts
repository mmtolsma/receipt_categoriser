import type { StatementTransaction } from "@/backend/statements/statement-transaction";

export type StatementMonthGroup = {
  monthKey: string;
  transactions: StatementTransaction[];
};

function formatDate(value: string) {
  return value.split(" ")[0] ?? value;
}

function getMonthKey(value: string) {
  return formatDate(value).slice(0, 7);
}

export function groupTransactionsByMonth(
  transactions: StatementTransaction[]
): StatementMonthGroup[] {
  const transactionsByMonth = Map.groupBy(transactions, (transaction) =>
    getMonthKey(transaction.transaction_date)
  );
  const orderedMonthKeys = Array.from(transactionsByMonth.keys()).toSorted();

  return orderedMonthKeys.map((monthKey) => ({
    monthKey,
    transactions: transactionsByMonth.get(monthKey) ?? [],
  }));
}
