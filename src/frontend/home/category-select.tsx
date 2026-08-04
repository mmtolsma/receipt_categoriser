import { APP_CATEGORIES, type AppCategory } from "@/backend/statements/categories";

type CategorySelectProps = {
  value: AppCategory;
  onChange: (category: AppCategory) => void;
};

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as AppCategory)}
      className="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-950 outline-none transition-colors focus:border-zinc-400"
      aria-label="Mapped category"
    >
      {APP_CATEGORIES.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
}
