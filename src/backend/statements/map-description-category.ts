import type { AppCategory } from "@/backend/statements/categories";

const DESCRIPTION_CATEGORY_RULES: Array<{
  pattern: RegExp;
  category: AppCategory;
}> = [
  { pattern: /VODACOM/i, category: "Debits" },
  { pattern: /SANLAM/i, category: "Debits" },
  { pattern: /DISC/i, category: "Debits" },
  { pattern: /OUTSURANCE/i, category: "Debits" },
  { pattern: /STRATUM/i, category: "Debits" },
  { pattern: /EQUITIES/i, category: "Investment" },
];

export function mapDescriptionCategory(
  originalDescription: string
): AppCategory | null {
  const matchingRule = DESCRIPTION_CATEGORY_RULES.find((rule) =>
    rule.pattern.test(originalDescription)
  );

  return matchingRule?.category ?? null;
}
