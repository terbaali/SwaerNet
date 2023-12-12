const express = require('express')
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');


const {v4: uuidv4 } = require('uuid');
const posts = [
    { 
        id: uuidv4(),
        message: 'KURWA!',
    },
];

// Esimerkki reitistä?
router.get('/', authenticateToken, (req, res) => {
    res.json(posts);
  });
  

module.exports = router