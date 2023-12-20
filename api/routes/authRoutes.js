const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const path = require('path');

//router.use(express.static(path.join(__dirname, '../swearnet/build')));

router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password/:resetToken', AuthController.resetPassword);
router.get('/reset-password/:resetToken', (req, res) => {
    res.sendFile(path.join(__dirname, '../../swearnet/build', 'index.html'));
});

module.exports = router;