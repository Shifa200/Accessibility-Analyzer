const express = require('express');
const router = express.Router();
const accessibilityController = require('../controllers/accessibilityController'); // We'll create this soon

// POST /api/accessibility/analyze (if using Vite proxy and path rewrite)
// Or POST /accessibility/analyze (if directly hitting backend without proxy path rewrite)
// We will use the simplified path as the proxy handles the /api part.
router.post('/analyze', accessibilityController.analyzeUrl);

module.exports = router;