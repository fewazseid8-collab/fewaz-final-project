**Fewaz Final Project — Pharmaceutical Inventory Management**

This repository contains a full-stack application for managing a pharmacy inventory, including products, suppliers, sales and user authentication.

Deployed Applications**
- **Backend (API)**: `https://final-2-h6wp.onrender.com`
- **Frontend (Client)**: `https://final-5-two.vercel.app/`
- **API Documentation (Swagger UI)**: `https://final-2-h6wp.onrender.com/api-docs`

Overview
- Backend: Node.js, Express, Mongoose (MongoDB), JWT-based authentication, Swagger (OpenAPI) for API documentation.
- Frontend: React (Create React App), Axios for API calls, basic components and pages under `src/pages`.

Repository layout
- `backend/` — Express API, models, controllers, routes, and Swagger setup.
- `frontend/` — React app and build output.
Important configuration
- The app uses environment variables for secrets and connection strings. Do not hard-code credentials in the repo.
- Example MongoDB connection string (replace `<db_password>` and `<dbname>` with your values):

```
mongodb+srv://fewazseid8_db_:<db_password>@cluster0.j8y0iey.mongodb.net/<dbname>?retryWrites=true&w=majority
```

Set `MONGODB_URI` in your environment to the full connection string. For production, use a secure secret store.

Local setup
1) Backend

```bash
cd backend
npm install
# create a .env file or set environment variables:
# MONGODB_URI, JWT_SECRET, PORT (optional), SWAGGER_SERVER_URL (optional)
cp .env.example .env  # if provided, then edit .env
npm start
```

The backend listens on `PORT` (default `4321`). The Swagger UI is served at `/api-docs` (e.g. `http://localhost:4321/api-docs`).

2) Frontend (development)

```bash
cd frontend
npm install
# set REACT_APP_API_URL to point to the backend, for example:
# REACT_APP_API_URL=https://final-2-h6wp.onrender.com/api
cp .env.example .env  # then update values
npm start
```

Useful endpoints (summary)
- `GET /api/products` — list products
- `POST /api/products` — create product
- `PUT /api/products/:id` — update product
- `DELETE /api/products/:id` — delete product

- `GET /api/suppliers`, `POST /api/suppliers`, `PUT /api/suppliers/:id`, `DELETE /api/suppliers/:id`

- `GET /api/sales`, `POST /api/sales`, `PUT /api/sales/:id`, `DELETE /api/sales/:id`

- `POST /api/users/register`, `POST /api/users/login`

For full API details, use the Swagger UI: `/api-docs` on the backend host.

Deployment notes
- The backend is deployed to Render at `https://final-2-h6wp.onrender.com`.
- The frontend is deployed to Vercel at `https://final-3-two.vercel.app/` and should set `REACT_APP_API_URL` to the backend API root (e.g. `https://final-2-h6wp.onrender.com/api`).
- Ensure production environment variables are configured in Render and Vercel (MongoDB connection string and `JWT_SECRET`).

Security and secrets
- Do not commit secrets to version control. Use environment variable configuration on your hosting provider.

Files of interest
- Backend entry: `backend/server.js`
- Swagger config: `backend/swagger.js` (registers `/api-docs`)
- Routes: `backend/routes/*.js`
- Controllers: `backend/controllers/*.js`

Next steps / Notes for maintainers
- Review `ENV_VARS.md` and `FINAL_DOCUMENTATION.md` for additional project-specific information (if present).
- If you want, I can:
  - Add an OpenAPI YAML file export, or expand `backend/swagger.js` docs with detailed schemas.
  - Update `FINAL_DOCUMENTATION.md` with deployment checklists.
  - Commit and push these README changes.


