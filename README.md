# Expense Tracker

An expense-only mobile tracker for the Philippines (₱), built with Expo, React Native, TypeScript, Expo Router, and a local SQLite database.

## Getting started

```bash
npm install
npm run android   # or: npm run ios / npm run web
```

## Project structure

- `src/app` — Expo Router screens (tabs, add-expense modal, categories)
- `src/db` — SQLite schema, migrations, and repositories
- `src/components` — reusable UI, expense, home, and chart components
- `src/hooks` / `src/store` — data-fetching hooks and shared UI state
- `src/constants` — theme tokens and default category seed data
- `src/utils` — currency, date, and grouping helpers
