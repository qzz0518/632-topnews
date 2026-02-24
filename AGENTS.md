# AGENTS.md

## Cursor Cloud specific instructions

This is a static HTML/CSS/JS web application (Chinese Hot News Aggregator / 热门新闻). It has **no package manager, no build system, and no dependencies to install**.

### Running the dev server

Serve the root directory with any static HTTP server:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/` in a browser.

### Key notes

- The app fetches news from the Toutiao API (`whyta.cn/api/toutiao`) via a CORS proxy (`corsproxy.io`). In sandboxed environments without internet access to these services, the news feed will show "获取新闻失败" (fetch failed). This is expected and not a code bug.
- Weather data uses hardcoded mock data (Beijing, 22°C, Sunny) rather than live API calls.
- There is no linting, no automated tests, and no build step — the project is purely static files.
- Favorites are stored in `localStorage` and persist across page reloads.
