const express = require('express');
const router = express.Router();
const segmentController = require('../controllers/segmentController');

router.post('/evaluate', segmentController.validateRules(), segmentController.evaluate);

module.exports = router;
