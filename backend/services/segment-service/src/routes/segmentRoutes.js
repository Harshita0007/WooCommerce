const express = require('express');
const router = express.Router();
const segmentController = require('../controllers/segmentController');

/**
 * @swagger
 * /api/segments/evaluate:
 *   post:
 *     summary: Evaluate segment rules
 *     tags: [Segments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rules:
 *                 type: string
 *                 example: "price > 1000\nstock_status = instock"
 *     responses:
 *       200:
 *         description: Filtered products
 */
router.post('/evaluate', segmentController.validateRules(), segmentController.evaluate);

module.exports = router;
