const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/', cartController.view);
router.post('/add', cartController.add);
router.post('/update', cartController.update);
router.post('/remove', cartController.remove);
router.post('/clear', cartController.clear);

module.exports = router;
