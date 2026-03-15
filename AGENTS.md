# AGENTS.md

## Cursor Cloud specific instructions

This is a pure static HTML/CSS/JS web app (Chinese Hot News Aggregator) with **no package manager, no build step, no test framework, and no linter**.

### Running the dev server

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/` in the browser. There is no hot-reload; refresh the page after editing files.

### Key caveats

- **No automated tests or lint checks exist.** All validation must be done manually via the browser.
- **News data depends on external APIs** (`whyta.cn` via `corsproxy.io` CORS proxy). These may be unreachable from the cloud VM due to network restrictions. The app gracefully shows "获取新闻失败，请稍后再试" when the API is unavailable.
- **Weather uses hardcoded mock data** (Beijing, 22°C, sunny) — the `fetchWeather()` function never calls the real OpenWeatherMap API.
- **No `package.json`** — do not attempt `npm install` or similar.
