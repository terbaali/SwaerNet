const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const AuthController = require('../controllers/authController');
const User = require('../models/useri');
const { authenticateToken } = require('../middlewares/auth');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);


module.exports = router;