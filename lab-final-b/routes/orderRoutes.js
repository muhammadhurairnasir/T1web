const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const applyDiscount = require('../middleware/applyDiscount');

// Order preview (apply discount from query)
router.get('/preview', applyDiscount, orderController.preview);

// Confirm order (place) - apply discount from form body before saving
router.post('/confirm', applyDiscount, orderController.confirm);

// Success / summary
router.get('/success/:id', orderController.success);

module.exports = router;
