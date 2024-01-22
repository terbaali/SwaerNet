const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/auth');

router.post('/register', UserController.register);
router.get('/activate/:activationToken', UserController.activateAccount);
router.post('/login', UserController.login);
router.get('/isAdmin', authenticateToken, UserController.checkAdminStatus); 

module.exports = router;