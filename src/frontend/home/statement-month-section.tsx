"use client";

import { useState } from "react";

import type { AppCategory } from "@/backend/statements/categories";
import type { StatementTransaction } from "@/backend/statements/statement-transaction";
import { buildCategoryChartData } from "@/frontend/home/build-category-chart-data";
import { Button } from "@/components/ui/button";
import { CategoryBarChart } from "@/frontend/home/category-bar-chart";
import { CategorySelect } from "@/frontend/home/category-select";

type StatementMonthSectionProps = {
  monthKey: string;
  transactions: StatementTransaction[];
  onCategoryChange: (rowNumber: number, category: AppCategory) => void;
};

type CategorisedTransaction = StatementTransaction & {
  mapped_category: AppCategory;
};

function formatDate(value: string) {
  return value.split(" ")[0] ?? value;
}

function formatMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split("-");
  const date = new Date(`${year}-${month}-01T00:00:00`);

  return new Intl.DateTimeFormat("en-ZA", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(amount);
}

function escapeCsvValue(value: string) {
  if (value.includes('"') || value.includes(",") || value.includes("\n")) {
    return `"${value.replaceAll('"', '""')}"`;
  }

  return value;
}

export function StatementMonthSection({
  monthKey,
  transactions,
  onCategoryChange,
}: StatementMonthSectionProps) {
  const [viewMode, setViewMode] = useState<"date" | "graph">("date");
  const interestTransactions = transactions
    .filter((transaction) => transaction.mapped_category === "Interest")
    .toSorted((leftTransaction, rightTransaction) =>
      leftTransaction.transaction_date.localeCompare(
        rightTransaction.transaction_date
      )
    );
  const feeTransactions = transactions.filter(
    (transaction) => transaction.mapped_category === "Fees"
  );
  const regularTransactions = transactions
    .filter(
      (transaction): transaction is CategorisedTransaction =>
        transaction.mapped_category !== "Fees" &&
        transaction.mapped_category !== "Interest"
    )
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
  const chartData = buildCategoryChartData(transactions);
  const uncategorisedCount = regularTransactions.filter(
    (transaction) => transaction.mapped_category === "Uncategorised"
  ).length;

  function handleExportMonth() {
    if (uncategorisedCount > 0) {
      window.alert(
        `${uncategorisedCount} row${
          uncategorisedCount === 1 ? " is" : "s are"
        } still uncategorised in ${formatMonthLabel(monthKey)}. Export will continue.`
      );
    }

    const csvRows = [
      ["Date", "Original Description", "Category", "Amount"],
      ...(consolidatedFeesAmount !== 0
        ? [["", "Consolidated fees", "", consolidatedFeesAmount.toString()]]
        : []),
      ...interestTransactions.map((transaction) => [
        formatDate(transaction.transaction_date),
        "Interest received",
        "",
        transaction.amount.toString(),
      ]),
      ...regularTransactions.map((transaction) => [
        formatDate(transaction.transaction_date),
        transaction.original_description,
        transaction.mapped_category,
        transaction.amount.toString(),
      ]),
    ];

    const csvContent = csvRows
      .map((row) => row.map((value) => escapeCsvValue(value)).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = `statement-${monthKey}.csv`;
    link.click();

    URL.revokeObjectURL(downloadUrl);
  }

  return (
    <section className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50/50">
      <div className="flex items-center justify-between gap-4 border-b border-zinc-200 bg-zinc-100/80 px-6 py-4 text-left">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-700">
          {formatMonthLabel(monthKey)}
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-white p-1 ring-1 ring-zinc-200">
            <Button
              type="button"
              variant={viewMode === "date" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("date")}
            >
              Date view
            </Button>
            <Button
              type="button"
              variant={viewMode === "graph" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("graph")}
            >
              Graph view
            </Button>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportMonth}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {viewMode === "graph" ? (
        <div className="bg-white p-6">
          <CategoryBarChart
            data={chartData}
            emptyMessage="No expense categories for this month."
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
        <table className="min-w-full table-fixed text-sm">
          <thead className="bg-white text-zinc-500">
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
          <tbody className="bg-white text-left">
            {consolidatedFeesAmount !== 0 ? (
              <tr className="border-t border-zinc-200 bg-zinc-50/80 align-top">
                <td className="px-6 py-4 text-left text-zinc-500">-</td>
                <td className="px-6 py-4 text-left font-medium text-zinc-950">
                  Consolidated fees
                </td>
                <td className="px-6 py-4 text-left text-zinc-500">-</td>
                <td className="px-6 py-4 text-left font-medium text-zinc-950">
                  -
                </td>
                <td className="px-6 py-4 text-left font-medium text-zinc-950">
                  {formatAmount(consolidatedFeesAmount)}
                </td>
              </tr>
            ) : null}
            {interestTransactions.map((transaction) => (
              <tr
                key={`${transaction.row_number}-${transaction.original_description}`}
                className="border-t border-zinc-200 bg-zinc-50/80 align-top"
              >
                <td className="px-6 py-4 text-left text-zinc-700">
                  {formatDate(transaction.transaction_date)}
                </td>
                <td className="px-6 py-4 text-left font-medium text-zinc-950">
                  Interest received
                </td>
                <td className="px-6 py-4 text-left text-zinc-500">-</td>
                <td className="px-6 py-4 text-left font-medium text-zinc-950">
                  -
                </td>
                <td className="px-6 py-4 text-left font-medium text-zinc-950">
                  {formatAmount(transaction.amount)}
                </td>
              </tr>
            ))}
            {regularTransactions.map((transaction) => (
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
      )}
    </section>
  );
}
