# InvestorMart mobile app

Expo SDK 57 React Native application for clients and property providers.

## Commands

```powershell
Copy-Item .env.example .env.local
npm.cmd ci
npm.cmd run typecheck
npm.cmd start
```

Use `npm.cmd run start:clear` after changing Metro, Babel, or NativeWind configuration.

## Structure

```text
src/
├── config/       Public runtime configuration
├── core/         Framework-level API and storage utilities
├── features/     Product features grouped by business capability
├── mock/         Temporary frontend-only fixtures
├── shared/       Reusable presentation components
└── types/        Shared TypeScript domain types
```

The application currently renders from mock data. Backend integration should replace feature data sources incrementally through `src/core/api` without placing secrets in the app.

The package and bundle identifiers are provisional until InvestorMart confirms its Play Console and App Store Connect identifiers.
