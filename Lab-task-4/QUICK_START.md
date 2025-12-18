# ⚡ Quick Start Guide

## 🚀 Start Everything in 3 Steps

### 1. Start Express Server
```bash
npm run dev
```
✅ Server running on `http://localhost:3000`

### 2. Start React Admin (New Terminal)
```bash
cd admin
npm start
```
✅ Admin panel on `http://localhost:3001`

### 3. Access Applications
- **Main Website:** http://localhost:3000
- **Admin Panel:** http://localhost:3001
- **Login:** admin@admin.com / admin

---

## 📍 Important Routes

### Main Website
- `/` - Homepage
- `/wildlife` - Products page
- `/checkout` - Checkout page

### Admin Panel
- `/admin` - Products list
- `/admin/products/create` - Add product
- `/admin/products/edit/:id` - Edit product
- `/admin/login` - Login page

### API Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get one product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/auth` - Login

---

## 🔑 Default Login
- **Email:** admin@admin.com
- **Password:** admin

---

## 📁 Key Files

- `server.js` - Express server setup
- `controllers/wildlifeController.js` - All product operations
- `routes/wildlifeRoutes.js` - All routes
- `admin/src/products/` - React admin components
- `models/Product.js` - Product database schema

---

## ⚠️ Common Issues

**Port conflict?** React will auto-use next port (3001, 3002...)

**MongoDB error?** Make sure MongoDB is running

**CORS error?** Check Express server is on port 3000

**Can't login?** Use: admin@admin.com / admin

---

For detailed guide, see `ADMIN_GUIDE.md`
