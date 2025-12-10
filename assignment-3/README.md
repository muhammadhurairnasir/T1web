# Assignment 3 - MongoDB Integration

Express.js e-commerce with MongoDB, pagination, and filtering.

## Requirements Completed

✅ Connect Express to MongoDB using Mongoose  
✅ Create Product model (name, price, category, image, description)  
✅ Insert sample product data  
✅ Display products from MongoDB  
✅ Implement pagination (page=1, limit=10)  
✅ Add filtering (category, price range)  

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Create `.env` File
```
MONGO_URI=mongodb://localhost:27017/besafari
PORT=3001
```

### 3. Add Sample Data
```bash
npm run seed
```

### 4. Start Server
```bash
npm run dev
```

Open `http://localhost:3001`

## Pages

- `/` - Homepage
- `/wildlife` - Products page (with pagination & filters)
- `/checkout` - Checkout page
- `/order-success` - Order confirmation

## Features

- View products from MongoDB
- Pagination (10 per page)
- Filter by category
- Filter by price range
- Add/Delete products

## Structure

```
assignment-3/
├── config/          - MongoDB connection
├── controllers/     - Product operations
├── models/          - Product & Counter models
├── routes/          - URL routes
├── views/           - EJS templates
├── public/          - CSS, images, JS
├── scripts/         - Sample data seeder
└── server.js        - Express server
```

