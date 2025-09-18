# AffordMed URL Shortener — Frontend & Backend

A modern, elegant URL shortener with analytics. The frontend is built with
React, Vite, and Material UI; the backend exposes a simple REST API for creating
and inspecting short links.

## Features

- Beautiful, responsive UI with Material UI and custom theme
- Light/Dark color mode with system preference detection
- Create short links with optional custom shortcode and expiry
- Analytics: total clicks and per-click metadata (timestamp, referer, user
  agent, IP, country)
- Copy-to-clipboard UX

## Tech Stack

- Frontend: React 19, Vite, TypeScript, Material UI 7 (@emotion)
- Routing: react-router-dom
- Backend: Any HTTP server (Node/Express, Fastify, etc.) implementing the API
  contract below

## Repository Structure

This README documents both the frontend and backend. If you are using only the
frontend (this folder), follow the Frontend section. If your backend lives in a
separate repository, ensure it implements the API contract below.

```
frontend/            # React + Vite app (this project)
  src/
    components/
    pages/
    services/
  index.html
  package.json
  bun.lock
```

---

## API Contract (Backend)

The frontend expects the backend to provide the following endpoints. All bodies
are JSON unless noted.

- POST `/shorturls`
  - Request body:
    ```json
    {
      "url": "https://example.com/very/long/path",
      "validity": 30,
      "shortcode": "myalias123"
    }
    ```
    - `validity` is minutes; omit or leave empty for no expiry
    - `shortcode` is optional; backend may validate uniqueness and allowed
      charset
  - Response 200:
    ```json
    {
      "shortLink": "https://your-base/{shortcode}",
      "expiry": "2025-01-01T00:00:00.000Z"
    }
    ```

- GET `/shorturls/{shortcode}`
  - Response 200:
    ```json
    {
      "shortcode": "abcd1",
      "originalUrl": "https://example.com",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "expiry": "2025-01-02T00:00:00.000Z",
      "totalClicks": 42,
      "clicks": [
        {
          "timestamp": "2025-01-01T12:00:00.000Z",
          "referer": "https://google.com",
          "userAgent": "Mozilla/5.0 ...",
          "ip": "203.0.113.10",
          "country": "IN"
        }
      ]
    }
    ```

- GET `/{shortcode}` (optional, backend responsibility)
  - Redirect (HTTP 302/307) to the original URL and record the click

Error responses should return a non-2xx status and `{ "message": string }` to
surface feedback in the UI.

---

## Frontend

### Requirements

- Bun (recommended) or Node.js 18+ with npm/pnpm/yarn

### Environment

Create `.env` in `frontend/`:

```
VITE_API_BASE_URL=http://localhost:3000
```

- Points the frontend to your backend base URL
- Defaults to `http://localhost:3000` if not provided

### Install

With Bun (recommended):

```
bun install
```

With npm:

```
npm install
```

### Run (development)

With Bun:

```
bun run dev
```

With npm:

```
npm run dev
```

Open the URL printed by Vite (e.g., `http://localhost:5173`). Ensure the backend
is running and has CORS `origin` configured to allow the frontend origin.

### Build & Preview

With Bun:

```
bun run build
bun run preview
```

With npm:

```
npm run build
npm run preview
```

### Lint

```
bun run lint
```

or

```
npm run lint
```

### UI/Theme

- Material UI with a custom theme defined in `src/theme.ts`
- Light/Dark mode toggle in the header (persists preference and honors system
  settings)
- Page components:
  - `Shorten` page to create links
  - `Stats` page to view analytics

### Key Files

- `src/theme.ts`: Theme generator and color mode context
- `src/main.tsx`: Theme provider wiring and color mode persistence
- `src/components/Layout.tsx`: App shell, navigation, color mode toggle
- `src/pages/Shorten.tsx`: Create short link form and result
- `src/pages/Stats.tsx`: Stats lookup and display
- `src/components/CopyField.tsx`: Copy-to-clipboard field
- `src/components/StatsTable.tsx`: Clicks table with sticky header and zebra
  rows
- `src/services/api.ts`: API base client and error handling
- `src/services/shortUrls.ts`: API calls for create and fetch stats

---

## Backend

You can implement the backend with any framework. Below are guidelines to align
with the frontend.

### Suggested Environment Variables

- `PORT=3000`
- `BASE_URL=http://localhost:3000` (used to build `shortLink`)
- `DATABASE_URL=...` (e.g., MongoDB or Postgres)
- `CORS_ORIGIN=http://localhost:5173` (frontend dev origin)

### Minimal Routes

- POST `/shorturls`
  - Validate `url`
  - Generate or validate unique `shortcode`
  - Calculate expiry if `validity` provided
  - Persist and return `{ shortLink, expiry }`

- GET `/shorturls/:shortcode`
  - Return metadata and click analytics as per contract

- GET `/:shortcode`
  - Redirect and record click (timestamp, referer, UA, IP, derived country)

### CORS

Enable CORS for the frontend origin. For example (Express):

```js
import cors from "cors";
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: false }));
```

### Example cURL

Create short URL:

```bash
curl -s -X POST \
  -H 'content-type: application/json' \
  -d '{"url":"https://example.com","validity":30,"shortcode":"myalias123"}' \
  http://localhost:3000/shorturls | jq
```

Get stats:

```bash
curl -s http://localhost:3000/shorturls/myalias123 | jq
```

---

## Deployment Notes

- Serve the frontend as static files (Vercel, Netlify, Nginx) and point it to
  your backend via `VITE_API_BASE_URL`
- Deploy the backend behind HTTPS; enable CORS properly
- Consider rate limiting and validation on create endpoint

## Troubleshooting

- 4xx/5xx with message in UI: check backend logs; ensure error responses include
  `{ "message": string }`
- CORS errors: set `CORS_ORIGIN` to the exact frontend origin and restart
  backend
- Empty analytics table: ensure redirect endpoint records clicks and that
  database writes succeed

## License

MIT © AffordMed
