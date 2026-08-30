# Unit4.CareerSim.Starter

Full-stack e-commerce capstone (DesShop): an Express/PostgreSQL API in [`server/`](server) and a React (Vite) storefront in [`capstone/capstone/`](capstone/capstone).

## Setup

1. Install the API dependencies: `npm install`
2. Install the frontend dependencies: `cd capstone/capstone && npm install`
3. Create a PostgreSQL database and set `DATABASE_URL` (defaults to `postgres://localhost/acme_auth_users_db`)
4. Optionally set `JWT_SECRET` and `PORT`
5. Start the API: `npm start` (or `npm run start:dev` to auto-reload) — this drops and recreates the tables and seeds demo users/products on every boot
6. In another terminal: `cd capstone/capstone && npm run dev` to start the storefront

## Project structure

- `server/index.js` — Express routes
- `server/db.js` — PostgreSQL schema and queries
- `capstone/capstone/` — React + Vite storefront
