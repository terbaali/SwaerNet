const express = require('express');
const router = express.Router();
const { activateAccount } = require('../controllers/authController');

router.get('/activate/:activationToken', activateAccount);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken', resetPassword);

module.exports = router;