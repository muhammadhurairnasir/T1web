const express = require("express");
const indexRoutes = require("./routes/indexRoutes");

const app = express();

// Set view engine to EJS
app.set("view engine", "ejs");

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from public directory
app.use(express.static("public"));

// Routes
app.use("/", indexRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

