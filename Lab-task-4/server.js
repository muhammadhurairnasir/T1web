require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const indexRoutes = require("./routes/indexRoutes");
const { wildlifeRouter, productApiRouter } = require("./routes/wildlifeRoutes");
const authRoutes = require("./routes/authRoutes");

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

// ============================================
// API ROUTES (JSON) - Must come before view routes
// ============================================
app.use("/api/products", productApiRouter);
app.use("/api/auth", authRoutes);

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

