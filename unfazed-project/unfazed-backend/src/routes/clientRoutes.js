const express = require('express');
const clientController = require('../controllers/clientController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireFeature } = require('../middleware/entitlementMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.get('/', clientController.listClients);
router.post('/', requireFeature('add_client'), clientController.createClient);
router.get('/:id', clientController.getClient);
router.patch('/:id', clientController.updateClient);

// Intake submission (in a full build this would sit behind a client-session
// token rather than the therapist's auth; simplified here for the scaffold)
router.post('/:id/intake', clientController.submitIntake);

module.exports = router;
