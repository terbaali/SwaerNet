const express = require('express')
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const postController = require('../controllers/postController');


router.get('/', postController.getPosts);
router.post('/', authenticateToken, postController.newPost);
router.delete('/:postId', authenticateToken, postController.deletePost);


module.exports = router