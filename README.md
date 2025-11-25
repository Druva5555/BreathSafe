# BreathSafe (Air Quality Index Finder)

A full-stack application to search Air Quality Index (AQI) by city, using the World Air Quality Index (WAQI) API.

- Backend: Node.js + Express
- Frontend: React (Vite) + TailwindCSS
- Caching: In-memory LRU with TTL,auto cleanup

## Folder Structure

```
AQI City Search Engine (Air Quality Index Finder)/
├─ backend/
│  ├─ package.json
│  ├─ .env.example
│  └─ src/
│     ├─ server.js
│     ├─ config/
│     │  └─ index.js
│     ├─ routes/
│     │  └─ aqiRoutes.js
│     ├─ controllers/
│     │  └─ aqiController.js
│     ├─ services/
│     │  └─ aqiService.js
│     ├─ utils/
│     │  └─ aqiMapper.js
│     ├─ cache/
│     │  ├─ index.js
│     │  └─ lruCache.js
│     └─ middlewares/
│        └─ errorHandler.js
└─ frontend/
   ├─ package.json
   ├─ index.html
   ├─ vite.config.js
   ├─ postcss.config.js
   ├─ tailwind.config.js
   └─ src/
      ├─ index.css
      ├─ main.jsx
      ├─ App.jsx
      └─ components/
         ├─ SearchBar.jsx
         └─ AqiCard.jsx
```

## Backend

- Framework: Express
- Endpoint: `GET /api/aqi?city={cityName}`
- External API: WAQI — https://aqicn.org/api/
  - Used endpoint: `https://api.waqi.info/feed/{city}/?token={TOKEN}`
  - Token environment variable: `AQICN_API_TOKEN`
- CORS enabled for local dev.

### Response Example

```json
{
  "fromCache": false,
  "city": { "name": "Delhi", "geo": [28.6, 77.2], "url": "http://aqicn.org/city/delhi" },
  "aqi": 175,
  "category": { "label": "Unhealthy", "level": "unhealthy", "color": "#ef4444" },
  "dominentPol": "pm25",
  "pollutants": { "pm25": 135, "pm10": 90, "no2": 22, "so2": 8, "co": 3, "o3": 10 },
  "time": { "iso": "2025-11-25T05:30:00+05:30", "tz": "+05:30", "s": "2025-11-25 05:30:00" },
  "source": { "name": "World Air Quality Index", "website": "https://aqicn.org" }
}
```

### Caching Strategy

- In-memory LRU with TTL.
- Configurable via env vars:
  - `CACHE_MAX_ENTRIES` (default 10)
  - `CACHE_TTL_MS` (default 600000 = 10 minutes)
  - `CACHE_CLEANUP_MS` (default 60000 = 1 minute)
- Auto cleanup of stale entries.
- Cache key: `aqi:{cityNameLowercased}`

### Run Backend

1. Copy env file and set your WAQI token:
   - `cd backend`
   - Copy `.env.example` to `.env` and set `AQICN_API_TOKEN`
2. Install and run:
   - `npm install`
   - `npm start`

Server runs on `http://localhost:4000`.

## Frontend

- Framework: React (Vite)
- Styling: TailwindCSS
- Dev proxy: Vite proxies `/api` to `http://localhost:4000`

### Run Frontend

1. `cd frontend`
2. `npm install`
3. `npm run dev`

page runs on `http://localhost:5173`.

## API Documentation

- `GET /api/aqi?city={cityName}`
  - Query params:
    - `city` (string, required)
  - Success: 200 with payload shown above
  - Errors:
    - 400 if `city` missing
    - 404/502 for provider errors


