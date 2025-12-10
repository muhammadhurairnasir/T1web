require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const indexRoutes = require("./routes/indexRoutes");
const wildlifeRoutes = require("./routes/wildlifeRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Set view engine to EJS
app.set("view engine", "ejs");

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from public directory
app.use(express.static("public"));

// Routes
app.use("/", indexRoutes);
app.use("/wildlife", wildlifeRoutes);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

