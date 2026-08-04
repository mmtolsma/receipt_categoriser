"use client";

import { useRef, useState } from "react";

import type { StatementTransaction } from "@/backend/statements/statement-transaction";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoaderCircleIcon, XIcon } from "lucide-react";

type UploadDialogProps = {
  onProcessingComplete: (transactions: StatementTransaction[]) => void;
};

type ProcessStatementResponse = {
  transactions: StatementTransaction[];
};

export function UploadDialog({ onProcessingComplete }: UploadDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setErrorMessage(null);
  }

  function clearSelectedFile() {
    setSelectedFile(null);
    setErrorMessage(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function handleProcessStatement() {
    if (!selectedFile) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("statement", selectedFile);

      const response = await fetch("/api/statements/process", {
        method: "POST",
        body: formData,
      });

      const responseBody = (await response.json()) as
        | ProcessStatementResponse
        | { error?: string };

      if (!response.ok || !("transactions" in responseBody)) {
        throw new Error(
          "error" in responseBody && responseBody.error
            ? responseBody.error
            : "Statement processing failed."
        );
      }

      onProcessingComplete(responseBody.transactions);
      clearSelectedFile();
      setOpen(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Statement processing failed."
      );
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button type="button" />}>
        Upload statement
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload bank statement</DialogTitle>
          <DialogDescription>CSV only for now.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
          />
          {selectedFile ? (
            <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
              <span className="truncate">{selectedFile.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={clearSelectedFile}
                aria-label={`Remove ${selectedFile.name}`}
              >
                <XIcon />
              </Button>
            </div>
          ) : null}
        </div>
        {errorMessage ? (
          <p className="text-sm text-red-600">{errorMessage}</p>
        ) : null}
        <Button
          type="button"
          onClick={handleProcessStatement}
          disabled={!selectedFile || isProcessing}
        >
          {isProcessing ? (
            <>
              <LoaderCircleIcon className="animate-spin" />
              Processing...
            </>
          ) : (
            "Process statement"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
