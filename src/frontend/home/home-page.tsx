"use client";

import { useState } from "react";

import type { AppCategory } from "@/backend/statements/categories";
import type { StatementTransaction } from "@/backend/statements/statement-transaction";
import { StatementResults } from "@/frontend/home/statement-results";
import { UploadDialog } from "@/frontend/home/upload-dialog";

export function HomePage() {
  const [transactions, setTransactions] = useState<StatementTransaction[]>([]);

  function handleCategoryChange(rowNumber: number, category: AppCategory) {
    setTransactions((currentTransactions) =>
      currentTransactions.map((transaction) =>
        transaction.row_number === rowNumber
          ? { ...transaction, mapped_category: category }
          : transaction
      )
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <section className="flex w-full max-w-5xl flex-col items-center gap-6 rounded-2xl bg-white px-8 py-16 text-center shadow-sm">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
          Let&apos;s Categorise Your Bank Statement!
        </h1>
        <UploadDialog onProcessingComplete={setTransactions} />
        {transactions.length > 0 ? (
          <StatementResults
            transactions={transactions}
            onCategoryChange={handleCategoryChange}
          />
        ) : null}
      </section>
    </main>
  );
}
