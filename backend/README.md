## HTTP URL Shortener Microservice (Bun + Express + Prisma)

A single-service URL shortener with robust logging, short code generation,
expiry handling, redirection, and per-link analytics.

### Tech Stack

- **Runtime**: Bun
- **Server**: Express 5 (TypeScript)
- **Database**: PostgreSQL (via Prisma ORM)
- **Logging**: Structured JSON to daily-rotated files

### Features

- **Create short URLs** with optional custom `shortcode`; uniqueness enforced
- **Default validity** 30 minutes when `validity` is omitted
- **Redirection** `GET /:shortcode` with 302 and expiry checks
- **Statistics** `GET /shorturls/:shortcode` including total clicks and click
  details
- **Mandatory logging** via custom middleware with `requestId` propagation; logs
  are written to files

---

### Prerequisites

- Bun v1.2+
- Docker + Docker Compose (for PostgreSQL)

### Environment

Create a `.env` in the project root:

```env
# Postgres connection string (matches docker-compose)
DATABASE_URL="postgresql://poll_user:poll_password@localhost:5432/poll_db?schema=public"

# HTTP server port
PORT=3000

# Base URL used to build returned short links
BASE_URL="http://localhost:3000"

# Optional: where logs should be written (default: ./logs)
LOG_DIR=./logs
```

---

### Install & Run (Local)

1. Install deps

```bash
bun install
```

2. Start PostgreSQL

```bash
docker compose up -d postgres
```

3. Generate Prisma client and run migrations

```bash
bun x prisma generate
bun x prisma migrate dev --name init
```

4. Run the server

```bash
bun run index.ts
# or with explicit LOG_DIR
LOG_DIR=./logs bun run index.ts
```

5. (Optional) Open Prisma Studio

```bash
bun x prisma studio
```

---

### API

#### Create Short URL

- **POST** `/shorturls`
- Body (JSON):

```json
{
    "url": "https://very-long-domain.com/path/to/resource",
    "validity": 30,
    "shortcode": "abcd1"
}
```

- Notes:
  - `url` is required and must start with `http://` or `https://`.
  - `validity` is minutes (integer). Defaults to 30 if omitted.
  - `shortcode` is optional. If provided, must be alphanumeric (3–32 chars) and
    unique; otherwise a unique code is generated.
- 201 Response:

```json
{
    "shortLink": "http://localhost:3000/abcd1",
    "expiry": "2025-01-01T00:30:00Z"
}
```

Curl example:

```bash
curl -X POST http://localhost:3000/shorturls \
  -H 'content-type: application/json' \
  -d '{"url":"https://example.com/page","validity":30}'
```

#### Redirect

- **GET** `/:shortcode`
- Behavior: 302 redirect to original URL if not expired
- Errors: 404 (unknown code), 410 (expired)

#### Statistics

- **GET** `/shorturls/:shortcode`
- 200 Response example:

```json
{
    "shortcode": "abcd1",
    "originalUrl": "https://example.com/page",
    "createdAt": "2025-09-18T06:00:00.000Z",
    "expiry": "2025-09-18T06:30:00.000Z",
    "totalClicks": 2,
    "clicks": [
        {
            "timestamp": "2025-09-18T06:20:00.000Z",
            "referer": "https://google.com",
            "userAgent": "Mozilla/5.0 ...",
            "ip": "::1",
            "country": null
        }
    ]
}
```

---

### Logging

- Logs are structured JSON and written to `LOG_DIR` (default `./logs`) as
  `app-YYYY-MM-DD.log`.
- Example commands:

```bash
# follow live logs
tail -f logs/app-$(date +%F).log

# pretty-print latest lines (jq optional)
tail -n 50 logs/app-$(date +%F).log | jq '.'
```

Each log line includes: `ts`, `level`, `name`, `message`, `requestId`, and
contextual fields (method, path, statusCode, durationMs, etc.).

---

### Project Structure

```
backend/
  index.ts
  prisma/
    schema.prisma
  src/
    db/prisma.ts
    logger.ts
    middleware/
      logging.ts
      error.ts
    routes/
      shorturls.ts
      redirect.ts
    utils/
      shortcode.ts
```

---

### Common Issues

- 400 "Invalid or missing url": `url` must be a valid HTTP(S) URL (emails are
  not URLs).
- 409 "Shortcode already in use": choose a different custom code or omit to
  auto-generate.
- 410 "Short link has expired": create a new short link or increase `validity`.

---

### Future Enhancements

- Redis cache for shortcode lookups and rate limiting
- GeoIP enrichment for `country`
- Soft-delete/restore short links and custom retention policies

### License

MIT (or as per repository policy)
