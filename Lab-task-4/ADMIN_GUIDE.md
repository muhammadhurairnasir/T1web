# 🎯 Complete Admin Panel & Express App Guide

## 📋 Table of Contents
1. [Project Structure](#project-structure)
2. [Starting the Application](#starting-the-application)
3. [Route Architecture](#route-architecture)
4. [API Endpoints](#api-endpoints)
5. [Admin Panel Usage](#admin-panel-usage)
6. [Troubleshooting](#troubleshooting)

---

## 📁 Project Structure

```
BeSafari Complete Site/
├── admin/                          # React Admin Dashboard
│   ├── public/                     # Static files
│   └── src/
│       ├── components/
│       │   ├── layout/            # NavBar component
│       │   ├── views/              # Page-level components
│       │   │   └── auth/           # Login, Register, AuthCheck
│       │   ├── examples/           # Demo components
│       │   └── redux-examples/     # Redux demo components
│       ├── products/               # Product management components
│       ├── services/               # API service (axiosInstance)
│       ├── store/                  # Redux store
│       │   ├── actions/            # Redux actions
│       │   └── reducers/          # Redux reducers
│       ├── App.js                  # Main React component
│       └── index.js                # React entry point
│
├── config/
│   └── db.js                       # MongoDB connection
│
├── controllers/
│   ├── wildlifeController.js      # All product operations (CRUD)
│   └── authController.js           # Authentication
│
├── models/
│   ├── Product.js                  # Product schema
│   └── Counter.js                  # Auto-increment counter
│
├── routes/
│   ├── indexRoutes.js              # Homepage, checkout routes
│   ├── wildlifeRoutes.js           # Product routes (views + API)
│   └── authRoutes.js               # Authentication routes
│
├── views/                          # EJS templates (main website)
│   ├── index.ejs                   # Homepage
│   ├── checkout.ejs                # Checkout page
│   ├── wildlife.ejs                # Products listing page
│   └── partials/                   # Header, footer, navbar
│
├── public/                          # Static assets
│   ├── images/                     # Product images
│   ├── css/                        # Stylesheets
│   └── js/                         # Client-side scripts
│
├── server.js                       # Express server entry point
└── package.json                    # Dependencies
```

---

## 🚀 Starting the Application

### Step 1: Install Dependencies

**For Express Server (Root Directory):**
```bash
npm install
```

**For React Admin Panel:**
```bash
cd admin
npm install
cd ..
```

### Step 2: Start MongoDB

Make sure MongoDB is running on your system:
```bash
# Windows (if installed as service, it should auto-start)
# Or start manually:
mongod
```

### Step 3: Start Express Server

**In the root directory:**
```bash
npm run dev
```

Server will start on: `http://localhost:3000`

### Step 4: Start React Admin Panel

**Open a NEW terminal window:**
```bash
cd admin
npm start
```

Admin panel will start on: `http://localhost:3001` (or next available port)

---

## 🗺️ Route Architecture

### Main Website Routes (EJS Views)

| Route | Method | Description | Controller |
|-------|--------|-------------|------------|
| `/` | GET | Homepage | `indexRoutes` |
| `/checkout` | GET | Checkout page | `indexRoutes` |
| `/order-success` | GET | Order success page | `indexRoutes` |
| `/wildlife` | GET | Products listing (with filters) | `wildlifeController.getAll` |
| `/wildlife/add` | POST | Create product (form submission) | `wildlifeController.create` |
| `/wildlife/update/:id` | POST | Update product (form submission) | `wildlifeController.update` |
| `/wildlife/delete/:id` | GET | Delete product | `wildlifeController.delete` |

### API Routes (JSON - For React Admin)

| Route | Method | Description | Controller |
|-------|--------|-------------|------------|
| `/api/products` | GET | Get all products | `wildlifeController.getAllJSON` |
| `/api/products/:id` | GET | Get single product | `wildlifeController.getByIdJSON` |
| `/api/products` | POST | Create product (with file upload) | `wildlifeController.createJSON` |
| `/api/products/:id` | PUT | Update product (with file upload) | `wildlifeController.updateJSON` |
| `/api/products/:id` | DELETE | Delete product | `wildlifeController.deleteJSON` |
| `/api/auth` | POST | Login (returns JWT token) | `authController.login` |

---

## 🔌 API Endpoints Details

### 1. GET `/api/products`
**Description:** Fetch all products from database

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "id": 1,
    "name": "Product Name",
    "price": 99.99,
    "category": "electronics",
    "image": "/images/product-1234567890.jpg",
    "description": "Product description",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 2. GET `/api/products/:id`
**Description:** Fetch single product by ID

**Parameters:**
- `id` (URL param): Product ID (MongoDB `_id` or custom `id`)

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "id": 1,
  "name": "Product Name",
  "price": 99.99,
  "category": "electronics",
  "image": "/images/product-1234567890.jpg",
  "description": "Product description"
}
```

### 3. POST `/api/products`
**Description:** Create new product with optional image upload

**Request Body (FormData):**
```
name: "Product Name"
price: "99.99"
color: "red" (or department: "electronics")
description: "Product description"
image: [File] (optional)
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "id": 1,
  "name": "Product Name",
  "price": 99.99,
  "category": "electronics",
  "image": "/images/product-1234567890.jpg",
  "description": "Product description"
}
```

### 4. PUT `/api/products/:id`
**Description:** Update existing product

**Parameters:**
- `id` (URL param): Product ID

**Request Body (FormData):**
```
name: "Updated Name" (optional)
price: "199.99" (optional)
color: "blue" (optional)
description: "Updated description" (optional)
image: [File] (optional - only if updating image)
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "id": 1,
  "name": "Updated Name",
  "price": 199.99,
  "category": "electronics",
  "image": "/images/product-1234567890.jpg",
  "description": "Updated description"
}
```

### 5. DELETE `/api/products/:id`
**Description:** Delete a product

**Parameters:**
- `id` (URL param): Product ID

**Response:**
```json
{
  "message": "Product deleted successfully",
  "product": { ... }
}
```

### 6. POST `/api/auth`
**Description:** Authenticate user and get JWT token

**Request Body:**
```json
{
  "email": "admin@admin.com",
  "password": "admin"
}
```

**Response:**
```
"demo-jwt-token-1234567890"
```

---

## 🎨 Admin Panel Usage

### Accessing the Admin Panel

1. **Start both servers** (Express + React)
2. **Navigate to:** `http://localhost:3001` (or the port shown in terminal)
3. **Login with:**
   - Email: `admin@admin.com`
   - Password: `admin`

### Admin Panel Features

#### 1. **Products List** (`/admin`)
- View all products
- Click "Add New Product" to create
- Click "Edit" to modify a product
- Click "Delete" to remove a product
- Click product name to view details

#### 2. **Add Product** (`/admin/products/create`)
- Fill in product details:
  - Name (required)
  - Price (required)
  - Color/Department (maps to category)
  - Description
  - Image (optional - JPG, PNG, GIF up to 5MB)
- Click "Add Product" to save

#### 3. **Edit Product** (`/admin/products/edit/:id`)
- Form pre-filled with existing data
- Modify any fields
- Upload new image (optional)
- Click "Edit Product" to save changes

#### 4. **Product Details** (`/admin/products/details/:id`)
- View full product information
- Links to edit or go back

### Authentication

- **Login:** `/admin/login`
- **Register:** `/admin/register` (placeholder)
- **Logout:** Click "Logout" in navbar (removes JWT token)

### Redux Examples

- **Redux Example:** `/admin/redux-example` - Simple state management demo
- **Redux Thunk Example:** `/admin/redux-thunk-example` - Async actions demo

---

## 🔧 Troubleshooting

### Common Issues

#### 1. **Port Already in Use**
**Error:** `Something is already running on port 3000`

**Solution:**
- Express server uses port 3000
- React app will automatically use next available port (3001, 3002, etc.)
- Or change port in `admin/package.json` proxy setting

#### 2. **MongoDB Connection Error**
**Error:** `Error connecting to MongoDB`

**Solution:**
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env` file
- Default: `mongodb://localhost:27017/besafari`

#### 3. **CORS Errors**
**Error:** `Access-Control-Allow-Origin` errors

**Solution:**
- CORS is already configured in `server.js`
- Ensure Express server is running on port 3000
- Check `admin/package.json` proxy setting matches

#### 4. **File Upload Not Working**
**Error:** Image upload fails

**Solution:**
- Check `public/images/` folder exists
- Ensure file is under 5MB
- Only JPG, PNG, GIF allowed
- Check multer configuration in `wildlifeController.js`

#### 5. **Products Not Loading**
**Error:** Empty product list or errors

**Solution:**
- Check MongoDB has products: Visit `http://localhost:3000/wildlife`
- Verify API endpoint: `http://localhost:3000/api/products`
- Check browser console for errors
- Verify Express server is running

#### 6. **Authentication Not Working**
**Error:** Can't login or access protected routes

**Solution:**
- Default credentials: `admin@admin.com` / `admin`
- Check JWT token in localStorage (browser DevTools)
- Verify `/api/auth` endpoint is working

---

## 📝 Development Workflow

### Adding a New Product (Via Admin Panel)

1. Start both servers
2. Login to admin panel
3. Click "Add New Product"
4. Fill form and submit
5. Product saved to MongoDB
6. Appears in both admin panel and main website

### Modifying Product Controller

**File:** `controllers/wildlifeController.js`

- All product operations are here
- View methods: `getAll`, `create`, `update`, `delete`
- API methods: `getAllJSON`, `getByIdJSON`, `createJSON`, `updateJSON`, `deleteJSON`

### Adding New Routes

**For View Routes (EJS):**
- Add to `routes/wildlifeRoutes.js` → `wildlifeRouter`
- Add controller method to `wildlifeController.js`

**For API Routes (JSON):**
- Add to `routes/wildlifeRoutes.js` → `productApiRouter`
- Add controller method to `wildlifeController.js`

### Database Schema

**Product Model** (`models/Product.js`):
```javascript
{
  id: Number,           // Auto-incremented
  name: String,         // Required
  price: Number,        // Required, min: 0
  category: String,     // Required
  image: String,        // Default: "/images/square.png"
  description: String,  // Required
  createdAt: Date,      // Auto
  updatedAt: Date      // Auto
}
```

---

## ✅ Quick Checklist

Before starting development:

- [ ] MongoDB is running
- [ ] Express server started (`npm run dev`)
- [ ] React admin panel started (`cd admin && npm start`)
- [ ] Both servers running without errors
- [ ] Can access `http://localhost:3000` (main site)
- [ ] Can access `http://localhost:3001` (admin panel)
- [ ] Can login to admin panel

---

## 🎯 Key Points

1. **Two Separate Applications:**
   - Express app (port 3000) - Main website + API
   - React app (port 3001+) - Admin dashboard

2. **Single Source of Truth:**
   - All product operations in `wildlifeController.js`
   - All routes in `wildlifeRoutes.js`

3. **API-First Design:**
   - React admin uses `/api/products` endpoints
   - Main website uses view routes (`/wildlife`)

4. **File Uploads:**
   - Handled by multer
   - Saved to `public/images/`
   - Accessible at `/images/filename.jpg`

---

## 📞 Support

If you encounter issues:
1. Check server console for errors
2. Check browser console (F12)
3. Verify MongoDB connection
4. Ensure all dependencies installed
5. Check route paths match exactly

---

**Last Updated:** 2024
**Version:** 1.0.0
