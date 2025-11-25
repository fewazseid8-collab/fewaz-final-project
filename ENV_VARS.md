ENVIRONMENT VARIABLES & RENDER SETTINGS

This file explains which environment variables are required and example Render Build/Start commands for this project.

Required environment variables

Backend (set on your Render Web Service under Environment > Environment Variables):
- `MONGODB_URI` — MongoDB connection string for production (private)
- `JWT_SECRET` — long random secret for signing JWTs (private)
- `NODE_ENV` — typically `production`
- `PORT` — optional; Render supplies one automatically

Frontend (set on your Render Static Site or at build time):
- `REACT_APP_API_URL` — base URL for API calls, e.g. `https://api.example.com/api` (Create React App reads vars at build-time; key must start with `REACT_APP_`)

Files added to repo as examples
- `backend/.env.example` — placeholders for backend variables (do not commit real secrets)
- `frontend/.env.example` — placeholder for `REACT_APP_API_URL`

Render Build / Start command recommendations

1) Deploying the backend as a Render Web Service (Root Directory = `backend`)
- Build Command: leave blank or use:
  ```bash
  npm ci
  ```
- Start Command:
  ```bash
  npm start
  ```

2) Deploying the backend with Root Directory = repo root (backend in `backend/`)
- Build Command:
  ```bash
  npm --prefix backend ci
  ```
- Start Command:
  ```bash
  npm --prefix backend start
  ```

3) Deploying the frontend as a Render Static Site (Root Directory = `frontend`)
- Build Command:
  ```bash
  npm ci && npm run build
  ```
  or (monorepo safe):
  ```bash
  npm --prefix frontend ci && npm --prefix frontend run build
  ```
- Publish Directory:
  ```text
  build
  ```

Notes
- Use `npm ci` when you have a lockfile for reproducible installs. Use `npm install` if you prefer.
- On Render, set environment variables in the Dashboard (safer) and mark sensitive variables as Private/Secret.
- For local development, copy `backend/.env.example` → `backend/.env` and fill in values. Do NOT commit your real `.env`.

If you want, I can also:
- Add a `backend/.env.example.local` with development defaults (e.g., local MongoDB URI).
- Try to set env vars via the Render API (requires a Render API key and service id).
