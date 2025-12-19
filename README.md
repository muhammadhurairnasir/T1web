# Lab Final B — BeSafari Theme (E-commerce)

Simple README to run the project (Express backend + React admin) and overview of the main folders.

---

## Quick Start

Requirements:
- Node.js (v18+ recommended)
- npm (v9+ recommended)
- MongoDB running (local or remote)

1) Configure environment
- Create a `.env` file in the project root (same folder as `server.js`) with at minimum:

```
MONGODB_URI=mongodb://localhost:27017/your_db_name
SESSION_SECRET=change_this_secret
PORT=3001
```

2) Start the Express backend

Open a terminal in the project root and run:

```powershell
cd "E:\WEB TECH COURSE\SAFARI THEME\lab-final-b"
node server.js
# or (if you prefer to use PORT env):
$env:PORT=3001; node server.js
```

The backend serves views (EJS) and JSON API endpoints. By default the server prints the listening URL, e.g. `http://localhost:3000` (or the `PORT` you configured).

3) Start the React admin UI (development)

Open a separate terminal and run:

```powershell
cd "E:\WEB TECH COURSE\SAFARI THEME\lab-final-b\admin"
npm install
npm start
```

- The React dev server runs (default `http://localhost:3000`).
- The React admin HTTP client uses `REACT_APP_BASE_URL` (or falls back to `http://localhost:3001`) to reach the Express API. To override, create `admin/.env` containing:

```
REACT_APP_BASE_URL=http://localhost:3001
```

4) Testing endpoints quickly

- Get orders (admin API): `GET http://localhost:3001/api/admin/orders`
- Update order status (example):


- Preview order with coupon: open `http://localhost:3001/order/preview?coupon=SAVE10`

---

## Folder overview (important files)

- `server.js` — Express app entrypoint (routes and middleware mount points)
- `package.json` — root dependencies and scripts for backend

- `models/` — Mongoose models
  - `Order.js` — Order schema (items, totals, discount, customerEmail, status)
  - `Product.js` — Product model used by shop views

- `controllers/` — Express controllers
  - `orderController.js` — preview, confirm, success, my-orders handlers
  - `adminOrderController.js` — JSON API for admin order management

- `routes/` — Express routers
  - `orderRoutes.js` — `/order/*` (preview, confirm, success, my-orders)
  - `adminRoutes.js` — `/api/admin/*` (orders, statuses, stats)

- `middleware/`
  - `applyDiscount.js` — coupon middleware (supports `SAVE10`, 10% off)

- `utils/`
  - `orderStatusValidator.js` — enforces status lifecycle: `Placed -> Processing -> Delivered`

- `views/` — EJS templates used by the public site
  - `order-preview.ejs`, `order-success.ejs`, `my-orders-form.ejs`, `my-orders-list.ejs`, etc.

- `public/` — static assets (css, js, images)

- `admin/` — React admin UI (separate app)
  - `admin/src/components/views/OrderList.jsx` — list and filter orders
  - `admin/src/components/views/OrderStatusModal.jsx` — update order status modal
  - `admin/src/services/axiosInstance.js` — axios client (default base URL `http://localhost:3001`)

---
