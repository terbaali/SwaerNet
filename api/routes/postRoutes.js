const express = require('express')
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');

// Testipostaus
const posts = [
    { 
        id: 1,
        message: 'KURWA!',
    }
];

// Esimerkki reitistä??
router.get('/', authenticateToken, (req, res) => {
    res.json(posts);
  });
  

module.exports = router