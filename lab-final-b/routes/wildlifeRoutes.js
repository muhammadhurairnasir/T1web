const express = require("express");
const router = express.Router();
const apiRouter = express.Router();
const wildlifeController = require("../controllers/wildlifeController");

// ============================================
// VIEW ROUTES (EJS Templates) - /wildlife
// ============================================
router.get("/", wildlifeController.getAll);
router.post("/add", wildlifeController.create);
router.post("/update/:id", wildlifeController.update);
router.get("/delete/:id", wildlifeController.delete);

// ============================================
// API ROUTES (JSON) - /api/products
// ============================================
apiRouter.get("/", wildlifeController.getAllJSON);
apiRouter.get("/:id", wildlifeController.getByIdJSON);
apiRouter.post("/", wildlifeController.createJSON);
apiRouter.put("/:id", wildlifeController.updateJSON);
apiRouter.delete("/:id", wildlifeController.deleteJSON);

module.exports = { wildlifeRouter: router, productApiRouter: apiRouter };

