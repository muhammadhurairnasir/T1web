require("dotenv").config();
const express = require("express");
const session = require("express-session");
const connectDB = require("./config/db");
const indexRoutes = require("./routes/indexRoutes");
const { wildlifeRouter, productApiRouter } = require("./routes/wildlifeRoutes");
const authRoutes = require("./routes/authRoutes");
// order routes will be mounted below (added in this change)
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
// Admin routes for order management (React dashboard integration)
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// CORS middleware - Allow React app to access API
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-auth-token"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Set view engine to EJS
app.set("view engine", "ejs");

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from public directory
app.use(express.static("public"));

// Session middleware (safe defaults) - used for session cart & order preview
app.use(
  session({
    secret: process.env.SESSION_SECRET || "change_this_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
  })
);

// Ensure a session cart exists and expose to templates via res.locals
app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = { items: {}, totalQty: 0, totalPrice: 0 };
  }
  res.locals.cart = req.session.cart;
  res.locals.cartItemCount = req.session.cart.totalQty || 0;
  next();
});

// ============================================
// API ROUTES (JSON) - Must come before view routes
// ============================================
app.use("/api/products", productApiRouter);
app.use("/api/auth", authRoutes);

// Admin routes (order management - React dashboard)
app.use("/api/admin", adminRoutes);

// Order routes (preview / confirm / success)
app.use("/order", orderRoutes);

// Cart routes (session)
app.use("/cart", cartRoutes);

// ============================================
// VIEW ROUTES (EJS Templates)
// ============================================
app.use("/", indexRoutes);
app.use("/wildlife", wildlifeRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

