# AGENTS.md

## Cursor Cloud specific instructions

This is a **Vite + vanilla JS** news aggregator with an industrial panel UI. It uses **pnpm** as the package manager.

### Running the dev server

```bash
pnpm dev
```

The app runs at `http://localhost:5173/`. Vite provides hot module replacement.

### Build

```bash
pnpm build
```

### Key caveats

- **No test framework or linter is configured.** All validation is manual via the browser.
- **News data comes from external RSS/API sources** proxied through Vite's dev server (see `vite.config.js` for proxy rules). The Vite proxy handles CORS. Sources: NHK (Japan), BBC (UK), CNN (US), Toutiao (China).
- **Mock/fallback data** is built into `src/main.js` — if any external source fails, the app gracefully falls back to sample headlines.
- **esbuild build scripts must be approved** — `pnpm.onlyBuiltDependencies` in `package.json` already allows esbuild.
- The auto-refresh progress bar re-fetches news every ~30 seconds.
