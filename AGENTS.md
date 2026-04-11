# AGENTS.md - MJL-2026

## Project Context
- **Type:** Mobile app for a bar (university project)
- **Stack:** Ionic 8 + Angular 20 (standalone) + Supabase + Capacitor 8
- **Features:** Login, menu (food/drinks), cart (no payment), future features TBD

## Commands (run from `MJL-APP/`)
```
npm start      # dev server
npm run build  # production build → www/
npm run lint   # eslint
npm run test   # karma/jasmine
```

## Architecture Notes
- All code lives in `MJL-APP/src/app/`
- Pages use `*Page` suffix, components use `*Component` suffix (ESLint rule)
- Selector prefix: `app-` (kebab-case for elements, camelCase for directives)
- Supabase credentials are hardcoded in `src/app/services/supabase-service.ts` (move to env vars later)
- `supabase-service.ts` uses Angular signals + `toObservable` for auth state
- `login-service.ts` wraps `signInWithPassword` and `signOut`

## Key Files
- `src/app/app.routes.ts` - routing config
- `src/app/services/supabase-service.ts` - Supabase client + auth signals
- `src/app/services/login-service.ts` - login/logout methods
- `src/app/components/login-form/` - login component (HTML empty)
- `src/app/home/` - default page (placeholder)

## DB Status
- Supabase tables not yet designed (categories, products, orders, cart items needed)
