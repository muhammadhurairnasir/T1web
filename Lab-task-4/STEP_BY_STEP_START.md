# 🚀 Step-by-Step: How to Run Your Project

## 📋 Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js installed (check with: `node --version`)
- ✅ MongoDB installed and running
- ✅ All dependencies installed

---

## 🎯 Step 1: Start MongoDB

**Open Terminal/PowerShell:**

```bash
# Check if MongoDB is running
# If not, start it:
mongod
```

**Or if MongoDB is installed as a Windows service, it should auto-start.**

**Verify MongoDB is running:**
- You should see: `waiting for connections on port 27017`
- Or check Windows Services for "MongoDB"

---

## 🎯 Step 2: Start Express Server

**Open Terminal/PowerShell #1:**

```bash
# Navigate to project root
cd "E:\WEB TECH COURSE\BeSafari Complete Site"

# Start the server
npm run dev
```

**Expected Output:**
```
[nodemon] starting `node server.js`
Server running on http://localhost:3000
MongoDB Connected: localhost
```

**✅ Success Indicators:**
- ✅ Server running on http://localhost:3000
- ✅ MongoDB Connected message
- ✅ No errors

**Keep this terminal open!**

---

## 🎯 Step 3: Start React Admin Panel

**Open a NEW Terminal/PowerShell #2:**

```bash
# Navigate to admin folder
cd "E:\WEB TECH COURSE\BeSafari Complete Site\admin"

# Start React app
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view admin in the browser.

  Local:            http://localhost:3001
  On Your Network:  http://192.168.x.x:3001

Note that the development build is not optimized.
```

**✅ Success Indicators:**
- ✅ Browser automatically opens
- ✅ React app loads at http://localhost:3001
- ✅ No compilation errors

**Keep this terminal open too!**

---

## 🎯 Step 4: Verify Everything Works

### Test Main Website (Express)

1. **Open browser:** http://localhost:3000
2. **You should see:** Homepage with navigation
3. **Click:** "PRODUCTS" or go to http://localhost:3000/wildlife
4. **You should see:** Products listing page

### Test Admin Panel (React)

1. **Open browser:** http://localhost:3001
2. **You should see:** Login page or redirect to login
3. **Login with:**
   - Email: `admin@admin.com`
   - Password: `admin`
4. **After login:** You should see Products list page

---

## 🎯 Step 5: Test Admin Panel Features

### View Products
- ✅ Products list should load
- ✅ Shows all products from database

### Add Product
1. Click **"Add New Product"** button
2. Fill in form:
   - Name: "Test Product"
   - Price: "99.99"
   - Color: Select "red" or "blue"
   - Description: "Test description"
   - Image: (Optional) Upload an image
3. Click **"Add Product"**
4. ✅ Should redirect to products list
5. ✅ New product should appear

### Edit Product
1. Click **"Edit"** on any product
2. Modify fields
3. Click **"Edit Product"**
4. ✅ Changes should save

### Delete Product
1. Click **"Delete"** on any product
2. ✅ Product should be removed from list

---

## 🎯 Step 6: Verify API Connection

### Test API Endpoint

**Open browser or use Postman:**
```
http://localhost:3000/api/products
```

**Expected Response:**
```json
[
  {
    "_id": "...",
    "id": 1,
    "name": "Product Name",
    "price": 99.99,
    "category": "electronics",
    "image": "/images/product-xxx.jpg",
    "description": "Description"
  }
]
```

✅ If you see JSON data, API is working!

---

## 🔧 Troubleshooting

### Problem: MongoDB Connection Error

**Error:** `Error connecting to MongoDB`

**Solution:**
```bash
# Make sure MongoDB is running
mongod

# Or check Windows Services
# Search for "MongoDB" in Services
```

### Problem: Port 3000 Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process or change port in .env
PORT=3001 npm run dev
```

### Problem: React App Won't Start

**Error:** `Something is already running on port 3000`

**Solution:**
- React will automatically use port 3001
- Just say "yes" when prompted
- Or manually change in `admin/package.json`:
  ```json
  "proxy": "http://localhost:3000"
  ```

### Problem: Can't Login to Admin

**Error:** Login doesn't work

**Solution:**
- Use exact credentials:
  - Email: `admin@admin.com`
  - Password: `admin`
- Check browser console (F12) for errors
- Verify Express server is running on port 3000

### Problem: Products Not Loading

**Error:** Empty list or errors

**Solution:**
1. Check Express server is running
2. Check MongoDB has data: Visit http://localhost:3000/wildlife
3. Check browser console (F12) for API errors
4. Verify API endpoint: http://localhost:3000/api/products

### Problem: CORS Errors

**Error:** `Access-Control-Allow-Origin` errors

**Solution:**
- CORS is already configured
- Make sure Express server is on port 3000
- Check `admin/package.json` proxy setting

---

## 📊 Quick Status Check

### ✅ Everything Working If:

- [ ] Express server shows: "Server running on http://localhost:3000"
- [ ] Express server shows: "MongoDB Connected"
- [ ] React app shows: "Compiled successfully"
- [ ] Main website loads at http://localhost:3000
- [ ] Admin panel loads at http://localhost:3001
- [ ] Can login to admin panel
- [ ] Products list shows in admin panel
- [ ] Can add/edit/delete products

---

## 🎯 Quick Commands Reference

### Start Express Server
```bash
cd "E:\WEB TECH COURSE\BeSafari Complete Site"
npm run dev
```

### Start React Admin
```bash
cd "E:\WEB TECH COURSE\BeSafari Complete Site\admin"
npm start
```

### Stop Servers
- Press `Ctrl + C` in each terminal
- Or close the terminal windows

---

## 🎉 Success!

If all steps work, you're ready to:
- ✅ Manage products via admin panel
- ✅ View products on main website
- ✅ Full CRUD operations working
- ✅ File uploads working
- ✅ Authentication working

---

## 📝 Notes

- **Two terminals needed:** One for Express, one for React
- **MongoDB must be running:** Before starting Express server
- **Ports:**
  - Express: 3000 (main website + API)
  - React: 3001 (admin panel)
- **Keep both terminals open:** While working

---

**Need help?** Check `ADMIN_GUIDE.md` for detailed documentation!
