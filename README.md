# Expense Tracker

An offline-first mobile app for tracking personal income and expenses in Philippine pesos (₱), built with React Native, Expo, and a local SQLite database.

## Project Overview

Expense Tracker is a personal software development project for people who want a simple, private way to record their daily spending and income without creating an account or relying on a cloud service. Every transaction, category, and setting is stored on the device, so the app works fully offline.

It was built for everyday users in the Philippines: amounts are formatted in pesos, the default categories and payment-method labels (cash, card, e-wallet, bank transfer) reflect local habits, and the interface is available in both English and Cebuano/Bisaya.

## Key Features

- **Income and expense tracking:** add, edit, and delete transactions with amount, category, date, payment method, an optional note, and an optional receipt photo.
- **Monthly dashboard:** shows the current balance, income and expense totals, a spending trend line, and recent transactions for the selected month.
- **Transaction history:** grouped by day, with search, income/expense filters, date presets (today, week, month, custom range), and sorting by date or amount.
- **Analytics:** an income vs. expense comparison, a daily spending bar chart, and category breakdowns shown as donut charts.
- **Custom categories:** create and edit income and expense categories with your own icons and colors. Categories that are still in use can't be deleted.
- **Backup and restore:** export categories, transactions, and settings to a JSON file and restore them later. Backup files are validated before anything is replaced. Receipt images are not included in backups.
- **CSV export:** share a spreadsheet-ready report of all transactions through the device's share sheet.
- **Personalization:** light, dark, or system theme; English or Cebuano/Bisaya; and a choice of date formats.

## Technology Stack

| Category | Technologies |
|---|---|
| Language | TypeScript 5.9 |
| Mobile Framework | React Native 0.81, Expo SDK 54, React 19.1 |
| Navigation | Expo Router 6 (file-based routing, typed routes) |
| Local Database | SQLite via `expo-sqlite` |
| State Management | Zustand, React Context |
| Charts | `react-native-gifted-charts`, `react-native-svg` |
| Device Capabilities | Expo Image Picker, Document Picker, File System, Sharing |
| Utilities | `date-fns`, `Intl.NumberFormat` (Philippine peso (PHP) formatting) |
| Build Tooling | EAS Build (development, preview APK, and production profiles) |

## Technical Highlights

- **Versioned schema migrations:** the database tracks its schema version with `PRAGMA user_version` and applies changes additively, so existing data is preserved when a device upgrades.
- **Atomic restore:** a backup is checked field by field, then restored inside a single SQLite transaction. If the restore fails partway, the previous data is left intact.
- **Repository layer:** SQL lives in typed repository modules (`src/db/repositories`) and is kept separate from the UI. Screens read data through custom hooks.

## Developer Information

- **Developer:** Rey C. Maghilom
- **Project Type:** Personal Software Development Project
- **Development Role:** Developer. All commits in this repository are authored by Rey C. Maghilom.
- **Also credited:** Cris S. Basco, listed as a developer on the app's About screen.

## Project Status

Version **1.0.0**, in development. The project is built with Expo, and EAS build profiles are configured for Android and iOS. Testing on iOS devices has not been verified. The app is not production-ready, has not been published to an app store, and does not have an automated test suite yet.

## Getting Started

Requires Node.js and the Expo Go app or an Android/iOS emulator.

```powershell
git clone https://github.com/reymaghilom/expense-tracker-app.git
cd expense-tracker-app
npm install
npm run android   # or: npm run ios
```

## License

See [LICENSE](LICENSE).
