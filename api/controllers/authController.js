const crypto = require('crypto');
const bcrypt = require('bcrypt');
const db = require('../db');
const util = require('util');
const query = util.promisify(db.query).bind(db);
const { sendResetPasswordEmail } = require('../controllers/mailController');

// Väliaikainen tallennuspalvelin
const temporaryStorage = {};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await query('SELECT * FROM users WHERE email = ?', [email]);

    if (!result || result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const resetToken = crypto.randomBytes(32).toString('hex');

    temporaryStorage[resetToken] = {
      email,
      resetToken,
      resetExpires: new Date(Date.now() + 900000),
    };

    sendResetPasswordEmail(email, resetToken);

    res.json({ message: 'Password reset link sent successfully' });
  } 
  catch (error) {
    console.error('Error sending reset password email:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const resetPassword = async (req, res) => {
  const { resetToken } = req.params;
  const { newPassword } = req.body;

  try {
    const temporaryUser = temporaryStorage[resetToken];

    if (!temporaryUser || temporaryUser.resetExpires < new Date()) {
      return res.status(401).json({ message: 'Invalid or outdated link' });
    }

    const { email } = temporaryUser;

    delete temporaryStorage[resetToken];

    res.json({ message: 'Password changed successfully' });
  } 
  catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
};
