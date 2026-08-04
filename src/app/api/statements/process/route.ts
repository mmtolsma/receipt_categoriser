import { NextResponse } from "next/server";

import { processStatement } from "@/backend/statements/process-statement";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const statementFile = formData.get("statement");

    if (!(statementFile instanceof File)) {
      return NextResponse.json(
        { error: "A CSV statement file is required." },
        { status: 400 }
      );
    }

    const result = await processStatement(statementFile);

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Statement processing failed.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
