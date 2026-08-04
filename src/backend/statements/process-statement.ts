import { mapBankCategory } from "@/backend/statements/map-bank-category";
import type { StatementTransaction } from "@/backend/statements/statement-transaction";

const REQUIRED_COLUMNS = [
  "Transaction Date",
  "Original Description",
  "Category",
  "Money In",
  "Money Out",
  "Fee",
] as const;

function splitDelimitedLine(line: string, delimiter: string) {
  const values: string[] = [];
  let currentValue = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === '"') {
      if (inQuotes && nextCharacter === '"') {
        currentValue += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (character === delimiter && !inQuotes) {
      values.push(currentValue);
      currentValue = "";
      continue;
    }

    currentValue += character;
  }

  values.push(currentValue);

  return values.map((value) => value.trim());
}

function detectDelimiter(headerLine: string) {
  return headerLine.includes("\t") ? "\t" : ",";
}

function parseNumber(value: string | undefined) {
  if (!value) {
    return null;
  }

  const normalizedValue = value.replace(/,/g, "").trim();

  if (!normalizedValue) {
    return null;
  }

  const parsedValue = Number(normalizedValue);

  return Number.isNaN(parsedValue) ? null : parsedValue;
}

function normalizeAmount({
  moneyIn,
  moneyOut,
  fee,
}: {
  moneyIn: number | null;
  moneyOut: number | null;
  fee: number | null;
}) {
  if (moneyIn !== null && moneyIn !== 0) {
    return Math.abs(moneyIn);
  }

  if (moneyOut !== null && moneyOut !== 0) {
    return moneyOut > 0 ? -moneyOut : moneyOut;
  }

  if (fee !== null && fee !== 0) {
    return fee > 0 ? -fee : fee;
  }

  return 0;
}

export async function processStatement(file: File) {
  const csvText = await file.text();
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error("The uploaded file does not contain any statement rows.");
  }

  const delimiter = detectDelimiter(lines[0]);
  const headerValues = splitDelimitedLine(lines[0], delimiter);
  const headerIndexMap = new Map(
    headerValues.map((header, index) => [header, index] as const)
  );

  for (const columnName of REQUIRED_COLUMNS) {
    if (!headerIndexMap.has(columnName)) {
      throw new Error(`Missing required column: ${columnName}`);
    }
  }

  const transactions: StatementTransaction[] = lines.slice(1).map((line, rowIndex) => {
    const values = splitDelimitedLine(line, delimiter);

    const transactionDate =
      values[headerIndexMap.get("Transaction Date") ?? -1] ?? "";
    const originalDescription =
      values[headerIndexMap.get("Original Description") ?? -1] ?? "";
    const bankCategory = values[headerIndexMap.get("Category") ?? -1] ?? "";
    const moneyIn = parseNumber(values[headerIndexMap.get("Money In") ?? -1]);
    const moneyOut = parseNumber(values[headerIndexMap.get("Money Out") ?? -1]);
    const fee = parseNumber(values[headerIndexMap.get("Fee") ?? -1]);

    return {
      row_number: rowIndex + 1,
      transaction_date: transactionDate,
      original_description: originalDescription,
      bank_category: bankCategory,
      money_in: moneyIn,
      money_out: moneyOut,
      fee,
      amount: normalizeAmount({ moneyIn, moneyOut, fee }),
      mapped_category: mapBankCategory(bankCategory),
    };
  });

  return { transactions };
}
