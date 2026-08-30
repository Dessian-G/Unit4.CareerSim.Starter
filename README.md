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

The frontend calls the API through relative `/api/...` paths, so it works
unchanged in dev (proxied by Vite, see `capstone/capstone/vite.config.js`)
and in production (built and served by the same Express app, see
`server/index.js`'s static file handling).

## Deploying (Render)

`render.yaml` at the repo root is a Render Blueprint that provisions a free
PostgreSQL database and a web service in one step, wired together
automatically (`DATABASE_URL` and a generated `JWT_SECRET`):

1. Push this repo to GitHub (already done if you're reading this from there)
2. On [Render](https://render.com), choose **New > Blueprint** and point it at this repo
3. Render builds the frontend and starts the API — no manual env var setup needed

Note: the API seeds demo users/products by dropping and recreating the
tables on every boot (see `server/index.js`'s `init()`), which is fine for
this demo but means the database resets on every deploy or restart.
