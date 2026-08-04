"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { XIcon } from "lucide-react";

export function UploadDialog() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  return (
    <Dialog>
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
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
