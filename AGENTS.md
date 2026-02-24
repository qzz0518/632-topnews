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

- The app supports 4 news sources (头条热榜, 百度热搜, 微博热搜, 知乎热榜) via the vvhan API (`api.vvhan.com`), with CORS proxy fallback and built-in mock data. In sandboxed/offline environments, it automatically degrades to demo data and shows a "✦ 演示数据" badge. This is by design.
- Weather data uses hardcoded mock data (Beijing, 22°C, Sunny).
- Dark mode state and favorites are stored in `localStorage`.
- There is no linting, no automated tests, and no build step — the project is purely static files.
