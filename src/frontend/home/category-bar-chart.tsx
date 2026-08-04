import type { CategoryChartDatum } from "@/frontend/home/build-category-chart-data";

type CategoryBarChartProps = {
  data: CategoryChartDatum[];
  emptyMessage?: string;
};

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function CategoryBarChart({
  data,
  emptyMessage = "No spending data available.",
}: CategoryBarChartProps) {
  const maximumTotal = data[0]?.total ?? 0;

  return (
      <div className="space-y-4">
        {data.length === 0 ? (
          <p className="text-sm text-zinc-500">{emptyMessage}</p>
        ) : (
          data.map((datum) => {
            const widthPercentage =
              maximumTotal > 0 ? (datum.total / maximumTotal) * 100 : 0;

            return (
              <div key={datum.category} className="space-y-2">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="font-medium text-zinc-950">{datum.category}</span>
                  <span className="text-zinc-600">{formatAmount(datum.total)}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-zinc-900 transition-[width]"
                    style={{ width: `${widthPercentage}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
  );
}
