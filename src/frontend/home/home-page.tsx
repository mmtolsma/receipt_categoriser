"use client";

import { useState } from "react";

import { UploadDialog } from "@/frontend/home/upload-dialog";

export function HomePage() {
  const [lastProcessedFileName, setLastProcessedFileName] = useState<
    string | null
  >(null);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <section className="flex w-full max-w-2xl flex-col items-center gap-6 rounded-2xl bg-white px-8 py-16 text-center shadow-sm">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
          Let&apos;s Categorise Those Receipts!
        </h1>
        <UploadDialog onProcessingComplete={setLastProcessedFileName} />
        {lastProcessedFileName ? (
          <p className="text-sm text-zinc-600">
            Processing complete for{" "}
            <span className="font-medium text-zinc-950">
              {lastProcessedFileName}
            </span>
            .
          </p>
        ) : null}
      </section>
    </main>
  );
}
