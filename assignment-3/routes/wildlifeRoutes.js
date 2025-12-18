const express = require("express");
const router = express.Router();
const wildlifeController = require("../controllers/wildlifeController");

// GET /wildlife - List all wildlife items
router.get("/", wildlifeController.getAll);

// POST /wildlife/add - Create new wildlife item
router.post("/add", wildlifeController.create);

// POST /wildlife/update/:id - Update wildlife item
router.post("/update/:id", wildlifeController.update);

// GET /wildlife/delete/:id - Delete wildlife item
router.get("/delete/:id", wildlifeController.delete);

// API Routes - Return JSON
// GET /wildlife/api - Get all wildlife items as JSON
router.get("/api", wildlifeController.getAllJSON);

// GET /wildlife/api/:id - Get single wildlife item by ID as JSON
router.get("/api/:id", wildlifeController.getByIdJSON);

// PUT /wildlife/api/:id - Update wildlife item via API
router.put("/api/:id", wildlifeController.updateJSON);

module.exports = router;

