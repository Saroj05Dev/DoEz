const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/Service_controller');
const { isAuthenticated, isAuthorized } = require('../middlewares/authMiddleware');

router.post('/', isAuthenticated, isAuthorized(['admin']),
    serviceController.upload.single("image"),
    serviceController.createService);

router.get('/', serviceController.getAllServices);

router.get('/:id', isAuthenticated, serviceController.getServiceById);

router.put('/:id', isAuthenticated, isAuthorized(['admin']),
    serviceController.upload.single("image"), serviceController.updateService);

router.delete('/:id', isAuthenticated, isAuthorized(['admin']), serviceController.deleteService);

module.exports = router;
