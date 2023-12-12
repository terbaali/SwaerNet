const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authenticateToken } = require('../middlewares/auth');

router.post('/register', async (req, res) => {
    try {   // Tarkista, onko käyttäjätunnus tai sähköpostiosoite jo käytössä
      const { username, email, password } = req.body;
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(400).json({ message: 'Username or email already in use' });
      }
      UserController.register(req, res); // UserControllerin rekisteröintifunktio
    } 
    catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});
router.post('/login', UserController.login);
router.post('/forgot-password', UserController.forgotPassword);
router.post('/reset-password', UserController.resetPassword);


module.exports = router;