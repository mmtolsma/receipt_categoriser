import { NextResponse } from "next/server";

import { processReceipt } from "@/backend/receipts/process-receipt";

export async function POST() {
  const result = await processReceipt();

  return NextResponse.json(result);
}
