import type { AppCategory } from "@/backend/statements/categories";
import type { StatementTransaction } from "@/backend/statements/statement-transaction";
import { CategorySelect } from "@/frontend/home/category-select";

type StatementResultsProps = {
  transactions: StatementTransaction[];
  onCategoryChange: (rowNumber: number, category: AppCategory) => void;
};

function formatDate(value: string) {
  return value.split(" ")[0] ?? value;
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function StatementResults({
  transactions,
  onCategoryChange,
}: StatementResultsProps) {
  const feeTransactions = transactions.filter(
    (transaction) => transaction.mapped_category === "Fees"
  );
  const nonFeeTransactions = transactions
    .filter((transaction) => transaction.mapped_category !== "Fees")
    .toSorted((leftTransaction, rightTransaction) => {
      const leftIsUncategorised =
        leftTransaction.mapped_category === "Uncategorised";
      const rightIsUncategorised =
        rightTransaction.mapped_category === "Uncategorised";

      if (leftIsUncategorised !== rightIsUncategorised) {
        return leftIsUncategorised ? -1 : 1;
      }

      const dateComparison = leftTransaction.transaction_date.localeCompare(
        rightTransaction.transaction_date
      );

      if (dateComparison !== 0) {
        return dateComparison;
      }

      return leftTransaction.row_number - rightTransaction.row_number;
    });
  const consolidatedFeesAmount = feeTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-200 px-6 py-4 text-left">
        <h2 className="text-lg font-semibold text-zinc-950">
          Mapped statement rows
        </h2>
        <p className="mt-1 text-sm text-zinc-600">
          Review the mapped categories before export.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed text-sm">
          <thead className="bg-zinc-50 text-zinc-500">
            <tr>
              <th className="w-36 px-6 py-3 text-left font-medium">Date</th>
              <th className="px-6 py-3 text-left font-medium">
                Original description
              </th>
              <th className="w-40 px-6 py-3 text-left font-medium">
                Bank category
              </th>
              <th className="w-40 px-6 py-3 text-left font-medium">
                Mapped category
              </th>
              <th className="w-32 px-6 py-3 text-left font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="text-left">
            {feeTransactions.length > 0 ? (
              <tr className="border-t border-zinc-200 bg-zinc-50/80 align-top">
                <td className="px-6 py-4 text-left text-zinc-500">-</td>
                <td className="px-6 py-4 text-left font-medium text-zinc-950">
                  Consolidated fees
                </td>
                <td className="px-6 py-4 text-left text-zinc-500">-</td>
                <td className="px-6 py-4 text-left font-medium text-zinc-950">
                  Fees
                </td>
                <td className="px-6 py-4 text-left font-medium text-zinc-950">
                  {formatAmount(consolidatedFeesAmount)}
                </td>
              </tr>
            ) : null}
            {nonFeeTransactions.map((transaction) => (
              <tr
                key={`${transaction.row_number}-${transaction.original_description}`}
                className={
                  transaction.mapped_category === "Uncategorised"
                    ? "border-t border-amber-200 bg-amber-50/70 align-top"
                    : "border-t border-zinc-200 align-top"
                }
              >
                <td className="px-6 py-4 text-left text-zinc-700">
                  {formatDate(transaction.transaction_date)}
                </td>
                <td className="px-6 py-4 text-left text-zinc-950">
                  {transaction.original_description}
                </td>
                <td className="px-6 py-4 text-left text-zinc-700">
                  {transaction.bank_category}
                </td>
                <td className="px-6 py-4 text-left font-medium text-zinc-950">
                  <CategorySelect
                    value={transaction.mapped_category}
                    onChange={(category) =>
                      onCategoryChange(transaction.row_number, category)
                    }
                  />
                </td>
                <td className="px-6 py-4 text-left text-zinc-700">
                  {formatAmount(transaction.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
