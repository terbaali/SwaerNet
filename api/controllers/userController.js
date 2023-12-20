const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/useri');
const db = require('../db');
const util = require('util');
const { sendActivationEmail } = require('../controllers/mailController');
require('dotenv').config();

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
  try {
    const rows = await queryAsync('SELECT * FROM users WHERE email = ?', [email]);
    
    if (rows.length === 1) {
    //if (rows.length === 1 && bcrypt.compareSync(row[0].password, rows[0].password)) { KORJAA TÄÄÄ
      const token = jwt.sign({ userId: rows[0].id }, JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ message: 'Logged in successfully', token });
    } 
    else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } 
  catch (error) {
    console.error('Error on login:', error);
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
  //forgotPassword,
  //resetPassword,
};