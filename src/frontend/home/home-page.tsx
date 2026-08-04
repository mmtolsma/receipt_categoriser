import { Button } from "@/components/ui/button";

export function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <section className="flex w-full max-w-2xl flex-col items-center gap-6 rounded-2xl bg-white px-8 py-16 text-center shadow-sm">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
          Let&apos;s Categorise Those Receipts!
        </h1>
        <Button type="button">Upload receipts</Button>
      </section>
    </main>
  );
}
