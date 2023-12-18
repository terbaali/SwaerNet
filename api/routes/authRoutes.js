const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

router.get('/activate/:activationToken', AuthController.activateAccount);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password/:resetToken', AuthController.resetPassword);

module.exports = router;