const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/Service_controller');
const { isAuthenticated, isAuthorized } = require('../middlewares/authMiddleware');

// Create a new service
router.post('/', isAuthenticated, isAuthorized(['admin']), serviceController.createService);

// Get all services
router.get('/', serviceController.getAllServices);

// Get a specific service by ID
router.get('/:id', isAuthenticated, serviceController.getServiceById);

// Update a service by ID
router.put('/:id', isAuthenticated, isAuthorized(['admin']), serviceController.updateService);

// Delete a service by ID
router.delete('/:id', isAuthenticated, isAuthorized(['admin']), serviceController.deleteService);

module.exports = router;
