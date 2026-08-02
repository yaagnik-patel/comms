# Community App

Swiss-grid styled homepage (Vibe D, cobalt-blue accent) built with React + Vite.

## Setup

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Structure

- `src/components/layout` — Nav, Section (bordered wrapper used by every section)
- `src/components/ui` — GridBlock (numbered grid cells), Button
- `src/pages` — Home.jsx (add Apply.jsx next, and wire it into `App.jsx`)
- `src/styles` — tokens.css (design variables), global.css (resets/base)

## Design tokens

All colors, spacing, and borders live in `src/styles/tokens.css` as CSS variables —
change `--accent` there to try a different accent color across the whole site.
