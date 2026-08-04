"use client";

import { useRef, useState } from "react";

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
  onProcessingComplete: (fileName: string) => void;
};

export function UploadDialog({ onProcessingComplete }: UploadDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
  }

  function clearSelectedFile() {
    setSelectedFile(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function handleProcessReceipt() {
    if (!selectedFile) {
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("receipt", selectedFile);

      const response = await fetch("/api/receipts/process", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Receipt processing failed.");
      }

      await response.json();
      onProcessingComplete(selectedFile.name);
      clearSelectedFile();
      setOpen(false);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button type="button" />}>
        Upload receipts
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload receipt images</DialogTitle>
          <DialogDescription>PNG and JPG only for now.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg"
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
        <Button
          type="button"
          onClick={handleProcessReceipt}
          disabled={!selectedFile || isProcessing}
        >
          {isProcessing ? (
            <>
              <LoaderCircleIcon className="animate-spin" />
              Processing...
            </>
          ) : (
            "Process receipt"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
