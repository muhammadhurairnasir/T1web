const express = require("express");
const router = express.Router();

// Homepage
router.get("/", (req, res) => {
  res.render("index");
});

// Checkout page
router.get("/checkout", (req, res) => {
  res.render("checkout");
});

// Order success page
router.get("/order-success", (req, res) => {
  res.render("order-success");
});

module.exports = router;

