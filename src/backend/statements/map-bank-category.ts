import type {
  AppCategory,
  BankCategory,
  StatementCategory,
} from "@/backend/statements/categories";

export const BANK_CATEGORY_TO_APP_CATEGORY: Record<
  BankCategory,
  StatementCategory
> = {
  Groceries: "Groceries",
  Fuel: "Petrol",
  Cellphone: "Debits",
  Fees: "Fees",
  "Medical Aid": "Health",
  "Vehicle Insurance": "Car service/stuff",
  "Life Insurance": "Debits",
  "Clothing & Shoes": "Clothes",
  "Cash Withdrawal": "Withdrawals",
  Restaurants: "Treat",
  Investments: "Investment",
  Pharmacy: "Health",
  Uncategorised: "Uncategorised",
  "Home Maintenance": "Home",
  Garden: "Home",
  "Personal Care": "Toiletries",
  "Sport & Hobbies": "Home",
  "Other Personal & Family": "Home",
  Licence: "Car service/stuff",
  Holiday: "Treat",
  "Other Income": "Salary",
  Donations: "Debits",
  Transfer: "Transfer",
  Interest: "Interest",
  "Digital Payments": "Debits",
  Internet: "Home",
  Education: "University",
  "Furniture & Appliances": "Home",
  "Doctors & Therapists": "Health",
  "Other Medical": "Health",
  "Online Store": "Guilt-free",
  Alcohol: "Treat",
  Gifts: "Gifts",
  Bonus: "Salary",
  "Software/Games": "Guilt-free",
  "Home Improvements": "DIY",
  Refunds: "Salary",
  "Digital Subscriptions": "Guilt-free",
  "Home Insurance": "Debits",
  "Vehicle Maintenance": "Car service/stuff",
};

export function mapBankCategory(bankCategory: string): StatementCategory {
  return (
    BANK_CATEGORY_TO_APP_CATEGORY[
      bankCategory as keyof typeof BANK_CATEGORY_TO_APP_CATEGORY
    ] ?? "Uncategorised"
  );
}
