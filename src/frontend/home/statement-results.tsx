import type { AppCategory } from "@/backend/statements/categories";
import { groupTransactionsByMonth } from "@/frontend/home/group-transactions-by-month";
import { StatementMonthSection } from "@/frontend/home/statement-month-section";
import type { StatementTransaction } from "@/backend/statements/statement-transaction";

type StatementResultsProps = {
  transactions: StatementTransaction[];
  onCategoryChange: (rowNumber: number, category: AppCategory) => void;
};

export function StatementResults({
  transactions,
  onCategoryChange,
}: StatementResultsProps) {
  const monthGroups = groupTransactionsByMonth(transactions);

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

      <div className="space-y-6 p-6">
        {monthGroups.map((monthGroup) => (
          <StatementMonthSection
            key={monthGroup.monthKey}
            monthKey={monthGroup.monthKey}
            transactions={monthGroup.transactions}
            onCategoryChange={onCategoryChange}
          />
        ))}
      </div>
    </section>
  );
}
