const evaluatorService = require('../services/evaluatorService');
const { body, validationResult } = require('express-validator');

class SegmentController {
  validateRules() {
    return [
      body('rules')
        .notEmpty()
        .withMessage('Rules text is required')
        .isString()
        .withMessage('Rules must be a string')
    ];
  }

  async evaluate(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { rules } = req.body;
      const result = await evaluatorService.evaluate(rules);
      
      res.json(result);
    } catch (error) {
      console.error('Evaluation error:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new SegmentController();
