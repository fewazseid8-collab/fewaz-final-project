Final Project — Documentation
Repository
- GitHub: https://github.com/fewazseid8-collab/fewaz-final-project
Overview
- This is a MERN-style application for pharmaceutical inventory management.
- Frontend: Create React App (React 19) in `frontend/`.
- Backend: Node.js + Express + MongoDB (Mongoose) in `backend/`.
Technology stack & tools
- Frontend: React, react-router-dom, axios, MUI (optional), Create React App (react-scripts).
- Backend: Node.js (ES modules), Express, Mongoose (MongoDB), JWT for auth, bcrypt for passwords, morgan for logging.
- Docs: Swagger UI integrated at `/api-docs` (served by `swagger-ui-express`).
- Dev tooling: nodemon for backend development, axios for HTTP client.
How to run locally
Prerequisites:
- Node.js (>=18 recommended)
- MongoDB access (local or hosted)
Backend (local):
```bash
cd backend
npm install
# set env vars in .env: MONGODB_URI, JWT_SECRET
npm run dev
# server runs on port 4321 by default
```
Frontend (local):
```bash
cd frontend
npm install
# set REACT_APP_API_URL=http://localhost:4321/api in your shell, or create .env
npm start
```
Deployment (recommended)
1) Backend — Render (recommended)
- Create a new Web Service on Render and connect the GitHub repo `fewaz-final-project`.
- Set the Root Directory to `backend`.
- Build/Start commands: install default, Start Command `npm start`.
- Add the environment variables in Render: `MONGODB_URI`, `JWT_SECRET` (and any other secrets).
- After deploy, your backend base URL will be e.g. `https://<service>.onrender.com`.
- Swagger UI will be at: `https://<service>.onrender.com/api-docs`.
2) Frontend — Vercel (recommended)
- Import project from GitHub and set the Root Directory to `frontend`.
- Build Command: `npm run build` (default). Output Directory: `build`.
- Add Environment Variable: `REACT_APP_API_URL` = `https://<backend-url>/api` (point to deployed backend).
Swagger Documentation URL
- After deploying the backend, the Swagger docs URL will be:
  - `https://<your-backend-base>/api-docs`
Testing and verification (quick checks)
- Verify products endpoint (replace backend URL):
  ```bash
  curl -sS https://<backend>/api/products | jq . | sed -n '1,20p'
  ```
- Verify Swagger HTML loads (open in browser):
  - `https://<backend>/api-docs`
- Verify frontend loads and communicates with backend by using the deployed frontend URL in a browser and testing product/sale flows.
Submission checklist (what to upload to Google Classroom)
- GitHub repo link: https://github.com/fewazseid8-collab/fewaz-final-project
- Frontend deployed URL: (paste Vercel URL)
- Backend deployed URL: (paste Render URL)
- Swagger docs URL: (backend_url)/api-docs
- This documentation file (`FINAL_DOCUMENTATION.md`) — included in repo root
If you want me to deploy the backend and frontend for you, provide either:
- Render API key (so I can create the web service and set env vars), and
- Vercel token (so I can create the Vercel project and set `REACT_APP_API_URL`).
Security note
- Do not commit secrets (MONGODB_URI, JWT_SECRET) to the repository. Use environment variables on the hosting provider.
Contact
- If you want, I can also add a GitHub Actions workflow to auto-deploy on push to `main`.
