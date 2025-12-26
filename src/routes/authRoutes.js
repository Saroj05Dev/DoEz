const express = require('express');
const { login, logout } = require('../controllers/authController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);

// ✅ REQUIRED FOR ADMIN ROUTE
router.get('/me', isAuthenticated, (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role
    }
  });
});

module.exports = router;
