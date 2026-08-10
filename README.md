# ClassyShop — MERN E-Commerce

A full MERN-stack e-commerce clone of the CLASSYSHOP reference sites, split into three apps:

- **`server/`** — Node.js + Express + MongoDB (Mongoose) REST API
- **`client/`** — React (Vite) + Tailwind CSS customer storefront
- **`admin/`** — React (Vite) + Tailwind CSS admin panel

## Prerequisites

- Node.js 18+ and npm
- A MongoDB database (local `mongod`, [MongoDB Atlas](https://www.mongodb.com/atlas), or Docker: `docker run -d -p 27017:27017 mongo`)
- A [Cloudinary](https://cloudinary.com) account (free tier is fine) for image uploads

## 1. Server setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env`:

```
MONGO_URI=mongodb://localhost:27017/classyshop   # or your Atlas connection string
JWT_ACCESS_SECRET=<any long random string>
JWT_REFRESH_SECRET=<a different long random string>
CLOUDINARY_CLOUD_NAME=<from your Cloudinary dashboard>
CLOUDINARY_API_KEY=<from your Cloudinary dashboard>
CLOUDINARY_API_SECRET=<from your Cloudinary dashboard>
```

Seed sample data (categories, products, an admin user, a home slide, and a banner):

```bash
npm run seed
```

This creates an admin login: **samiullahwaheed786@gmail.com / sami123**

Start the API (default `http://localhost:5000`):

```bash
npm run dev
```

## 2. Admin panel setup

```bash
cd admin
npm install
cp .env.example .env   # defaults already point at http://localhost:5000/api/v1
npm run dev
```

Open `http://localhost:5174` and log in with the seeded admin credentials above.

## 3. Client (storefront) setup

```bash
cd client
npm install
cp .env.example .env   # defaults already point at http://localhost:5000/api/v1
npm run dev
```

Open `http://localhost:5173`.

## Environment variables reference

**`server/.env`**

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Signing secrets for access/refresh tokens |
| `JWT_ACCESS_EXPIRES_IN` / `JWT_REFRESH_EXPIRES_IN` | Token lifetimes (default `15m` / `30d`) |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary credentials for image uploads |
| `CLIENT_URL` / `ADMIN_URL` | Allowed CORS origins |
| `COOKIE_DOMAIN` | Domain for the httpOnly refresh-token cookie |

**`client/.env`** and **`admin/.env`**

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the server API, e.g. `http://localhost:5000/api/v1` |

## Architecture notes

- **Auth**: JWT access tokens (kept in Redux memory, never localStorage) + httpOnly refresh-token cookie, with role-based access control (`customer` vs `admin`) enforced server-side via middleware. The admin app calls a dedicated `/auth/admin/login` endpoint that rejects non-admin accounts.
- **State management**: Redux Toolkit + RTK Query in both frontends. The client additionally persists the cart to `localStorage` via `redux-persist`.
- **Images**: uploaded through a single generic `/upload/image` endpoint that streams to Cloudinary; used by every admin form (products, categories, banners, home slides, blogs, logo) and the client's own avatar upload.
- **Checkout**: Cash-on-Delivery only, matching the reference site.

## Project structure

```
ClassyShop/
├── server/   Express API — src/{config,models,controllers,routes,middleware,utils,validators}
├── client/   Storefront — src/{app,features,components,pages}
├── admin/    Admin panel — src/{app,features,components,pages}
```

See `client/src/App.jsx` and `admin/src/App.jsx` for the full route maps.
