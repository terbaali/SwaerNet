require('dotenv').config();
const db = require('../db');
const util = require('util');

const query = util.promisify(db.query).bind(db);

const getPosts = async (req, res) => {
  try {
    const posts = await query('SELECT posts.*, users.username as username FROM posts JOIN users ON posts.user_id = users.user_id');
    res.json(posts);
  } 
  catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const newPost = async (req, res) => {
  const { user_id, postMessage } = req.body;
  const token = req.headers.authorization;

  try {
    //const activeUser = await query('SELECT user_id FROM login_attempts WHERE token = ? AND expires > NOW()', [token]);
    const activeUser = await query('SELECT user_id FROM login_attempts WHERE token = ?', [token]);

    if (!activeUser || activeUser.length === 0) {
      return res.status(401).json({ message: 'User is not active or session has expired' });
    }

    const result = await query('INSERT INTO posts (user_id, message) VALUES (?, ?)', [user_id, postMessage]);

    if (result.affectedRows > 0) {
      res.json({ message: 'Post added successfully' });
    } 
    else {
      res.status(500).json({ message: 'Failed to add post' });
    }
  } 
  catch (error) {
    console.error('Error adding post:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deletePost = async (req, res) => {
  const postId = req.params.postId;
  const token = req.headers.authorization;

  try {
    const activeUser = await query('SELECT user_id FROM login_attempts WHERE token = ?', [token]);

    if (!activeUser || activeUser.length === 0) {
      return res.status(401).json({ message: 'User is not active or session has expired' });
    }

    const post = await query('SELECT user_id FROM posts WHERE post_id = ?', [postId]);

    if (!post || post.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (activeUser[0].user_id !== post[0].user_id && activeUser[0].isAdmin !== 1) {
      return res.status(403).json({ message: 'You do not have permission to delete this post' });
    }

    const result = await query('DELETE FROM posts WHERE post_id = ?', [postId]);

    if (result.affectedRows > 0) {
      res.json({ message: 'Post deleted successfully' });
    } 
    else {
      res.status(500).json({ message: 'Failed to delete post' });
    }
  } 
  catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports = {
  getPosts,
  newPost,
  deletePost,
};  