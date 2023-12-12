const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser } = require('../models/user');
const { sendActivationEmail } = require('../controllers/mailController');

const register = async (req, res) => {
  const { username, email, password } = req.body;

  const user = {
    user_name: username,
    email,
    role: 'user',
    password, 
  };

  try {
    const userId = await createUser(user);
    res.status(201).json({ message: 'Registration was successful', userId });
  } catch (error) {
    console.error('Virhe rekisteröinnissä:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const login = async (req, res) => {
  // Käyttäjän kirjautuminen
  const { email, password } = req.body;

  // Etsi käyttäjä sähköpostiosoitteen perusteella
  const user = await User.findOne({ email });

  // Tarkista salasana
  if (user && bcrypt.compareSync(password, user.password)) {
    // Luo JWT-token
    const token = jwt.sign({ userId: user._id }, 'salaisuus', { expiresIn: '1h' });

    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
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
  //forgotPassword,
  //resetPassword,
};