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

