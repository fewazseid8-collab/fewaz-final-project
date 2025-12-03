# Fewaz Final Project — Pharmaceutical Inventory Management

This repository contains a full-stack application for managing a pharmacy inventory, including products, suppliers, sales and user authentication.
Full‑stack application
Has both a frontend (user interface) and a backend (API + business logic).
Frontend: React app that calls the API and shows pages for products, suppliers and sales.
Backend: Node + Express that implements REST endpoints, validation, and persistence.
Managing a pharmacy inventory — primary features

Products: create, read, update, delete product records (name, price, stock, etc.).
Suppliers: manage supplier contact/info and link supplies to products.
Sales: record sales transactions, decrement stock, and produce simple reports.
User authentication and authorization.

Users must log in to perform protected actions.
Backend issues JWTs on login; protected endpoints require Authorization: Bearer <token>.
Typical roles: admin (full access) and staff (limited access).
Persistence and API docs

Data stored in MongoDB (Mongoose models).
Swagger (OpenAPI) exposes interactive API docs at /api-docs to explore and test endpoints.
How this maps to the repository

frontend/: React source, UI components and API client.
backend/: Express routes, controllers, models, middleware (auth, error handling), swagger config.
.env (local only): connection strings and secrets (MONGODB_URI, JWT_SECRET, SWAGGER_SERVER_URL).
How to demonstrate start→end (useful for grading)

Start backend and frontend (or use deployed URLs).
Register or use the test accounts (for admin test: username= admin
                                                   password= admin or 
                                   for staff test: username= staff
                                                   password= staff).
Log in and obtain JWT.
Use the frontend or curl/Swagger to create a product, add a supplier, record a sale, and view inventory change.
Show protected endpoints rejecting requests without a token


# Deployed Applications
- Backend (API): https://final-project-q0vi.onrender.com/
- Frontend (Client): https://fewaz-pharmaceutical.vercel.app/
- API Documentation (Swagger UI): https://final-project-q0vi.onrender.com/api-docs/

Overview
- Backend: Node.js, Express, Mongoose (MongoDB), JWT-based authentication, Swagger (OpenAPI) for API documentation.
- Frontend: React (Create React App), Axios for API calls, basic components and pages listed under `src/pages`.

Repository layout
- `backend/` — Express API, models, controllers, routes, and Swagger setup.
- `frontend/` — React app and build output.
Important configuration
- The app uses environment variables for secrets and connection strings. Do not hard-code credentials in the repo.

deployment setup
1) Backend

terminal:
cd backend
npm install
  create a .env file or set environment variables:
  MONGODB_URI, JWT_SECRET, PORT (optional), SWAGGER_SERVER_URL (optional)
npm start


The backend listens on PORT (default `4321`). The Swagger UI is served at `/api-docs` ( e.g`http://localhost:4321/api-docs`).

2) Frontend (development)

cd frontend
npm install
  set REACT_APP_API_URL to point to the backend, for example:
  REACT_APP_API_URL=https://final-2-h6wp.onrender.com/api
npm start

Useful endpoints (for testing)
- GET /api/products — list products
- POST /api/products — create product
- PUT /api/products/:id — update product
- DELETE /api/products/:id — delete product

- GET /api/suppliers, POST /api/suppliers, PUT /api/suppliers/:id, DELETE /api/suppliers/:id
- GET /api/sales, POST /api/sales, PUT /api/sales/:id, DELETE /api/sales/:id
- POST /api/users/register, POST /api/users/login

For full API details, use the Swagger UI: `/api-docs` on the backend host.

Deployment notes
- The backend is deployed to Render at `https://final-2-h6wp.onrender.com`.
- The frontend is deployed to Vercel at `https://final-3-two.vercel.app/` and should set `REACT_APP_API_URL` to the backend API root (e.g. `https://final-2-h6wp.onrender.com/api`).
- Ensure production environment variables are configured in Render and Vercel (MongoDB connection string and `JWT_SECRET`).

Security and secrets
- Do not commit secrets to version control. Use environment variable configuration on your hosting provider.

Files of interest
- Backend entry: backend/server.js
- Swagger config: backend/swagger.js (registers `/api-docs`)
- Routes: backend/routes/*.js
- Controllers: backend/controllers/*.js



