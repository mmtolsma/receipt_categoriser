# Receipt Categoriser

Local web tool for importing bank statement CSVs, mapping bank categories into a custom category set, reviewing the results, and exporting monthly CSVs.

## Current Stack

- Next.js
- TypeScript
- React
- Tailwind CSS
- shadcn/ui
- pnpm

## Current Functionality

- Upload a bank statement CSV from the browser
- Read the required columns:
  - `Transaction Date`
  - `Original Description`
  - `Category`
  - `Money In`
  - `Money Out`
  - `Fee`
- Map bank categories into app categories
- Apply description-based category overrides for selected keywords
- Group rows by month
- Review rows in a date-based monthly view
- Edit mapped categories per row
- Switch each month between date view and graph view
- Export a reviewed month as CSV
- Warn before export when a month still contains uncategorised rows

## Current Backend Logic

- CSV parsing happens in the app backend
- Bank category mapping is handled through a dedicated mapping layer
- Description keyword overrides are applied before bank category fallback
- Statement data is kept in memory on the frontend after processing
- No database or external API integration is currently used

## Local Development

```bash
pnpm dev
pnpm build
pnpm lint
```
