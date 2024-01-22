const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');
const { sendActivationEmail } = require('../controllers/mailController');
require('dotenv').config();
const db = require('../db');

const query = util.promisify(db.query).bind(db);

const { JWT_SECRET } = process.env;
const temporaryStorage = {};

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const activationToken = crypto.randomBytes(32).toString('hex');
    
    temporaryStorage[activationToken] = {
      username,
      email,
      password,
      activationToken,
      activationExpires: Date.now() + 900000, // 15 minuuttia
    };

    sendActivationEmail(email, activationToken);

    res.status(201).json({ message: 'Registration was successful. Check your email for activation instructions.' });
  } catch (error) {
    console.error('Error on Registration:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const addUserToDatabase = async (user) => {
  try {
    const result = await query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [
      user.username,
      user.password,
      user.email
    ]);

    console.log('User added to database:', result);

    return result;
  } catch (error) {
    console.error('Error adding user to database:', error);
    throw error;
  }
};

const activateAccount = async (req, res) => {
  const { activationToken } = req.params;

  try {
    const temporaryUser = temporaryStorage[activationToken];

    if (!temporaryUser) {
      return res.status(404).json({ message: 'Invalid activation link' });
    }    
    await addUserToDatabase(temporaryUser);

    delete temporaryStorage[activationToken];

    return res.status(200).json({ message: 'Account activated successfully' });
  } 
  catch (error) {
    console.error('Error activating account:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


const queryAsync = util.promisify(db.query).bind(db);

const login = async (req, res) => {
  const { email, password } = req.body;
  const ip = req.ip;

  try {
    var token = null
    var succeed = false
    const rows = await queryAsync('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 1 && bcrypt.compareSync(password, rows[0].password)) {
      let data = {
        userId: rows[0].user_id,
        userName: rows[0].username,
        isAdmin: rows[0].isAdmin,
        expiresIn: Date.now() + 3600000
      }
      token = jwt.sign({ data: data }, JWT_SECRET, { expiresIn: '1h' });
      succeed = true; 
    } 
    else {
      const insertResult = await queryAsync(
        'CALL handle_login_attempt (?, ?, ?, ?, @a, @a)',
        [ip, succeed, rows[0].user_id, token]
      );
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const insertResult = await queryAsync(
      'CALL handle_login_attempt (?, ?, ?, ?, @a, @a)',
      [ip, succeed, rows[0].user_id, token]
    );

    if (insertResult[1] && insertResult[1].length > 0) {
      return res.status(200).json({ message: 'Logged in successfully', token });
    } 
    else {
      if (insertResult[1][0].new_banned) {
        const baninfo = insertResult[1][0];
        const banCookieInfo = {
          banned: insertResult[1][0].new_banned,
          expires: insertResult[1][0].new_expires,
        };
        res.cookie('banInfo', banCookieInfo, { maxAge: insertResult[1][0].new_expires-Date.now(), httpOnly: false });
        return res.status(403).json({ message: 'UR BANNED', baninfo });
      }
      return res.status(501).json({ message: 'Failed to log in' });
    }
    
  } 
  catch (error) {
    console.error('Error on login:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


const checkAdminStatus = async (req, res) => {
  const token = req.headers.authorization;

  try {
    const user = await queryAsync('SELECT isAdmin FROM users WHERE user_id = ?', [req.user.userId]);

    if (!user || user.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isAdmin = user[0].isAdmin === 1;
    res.json(isAdmin);
  } 
  catch (error) {
    console.error('Error checking admin status:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/*
const forgotPassword = async (req, res) => {
  // Salasanan palauttaminen
  const { email } = req.body;

  // Etsi käyttäjä sähköpostiosoitteen perusteella
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Luo yksilöllinen token
  const token = crypto.randomBytes(32).toString('hex');

  // Tallenna token käyttäjän tietoihin tietokantaan
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 900000; // 15 minuuttia

  await user.save();

  // Lähetä sähköposti käyttäjälle linkin kera
  res.json({ message: 'Password change link sent successfully' });
};

const resetPassword = async (req, res) => {
  // Salasanan vaihto
  const { token, newPassword } = req.body;

  // Etsi käyttäjä tokenin ja voimassaoloajan perusteella
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(401).json({ message: 'Invalid or outdated link' });
  }

  // Vaihda salasana ja tyhjennä token-kentät
  user.password = bcrypt.hashSync(newPassword, 10);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;

  await user.save();

  res.json({ message: 'Password changed successfully' });
};
*/

module.exports = {
  register,
  login,
  activateAccount,
  checkAdminStatus,
  //forgotPassword,
  //resetPassword,
};