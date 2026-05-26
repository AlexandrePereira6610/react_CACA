const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin, validateUpdateProfile } = require('../middleware/validationMiddleware');

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, validateUpdateProfile, updateProfile);

module.exports = router;