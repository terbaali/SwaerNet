const User = require('../models/User');
const { sendResetPasswordEmail } = require('../controllers/mailController');
const crypto = require('crypto');

const activateAccount = async (req, res) => {
  const { activationToken } = req.params;

  try {
    // Etsi käyttäjä aktivointitokenin perusteella
    const user = await User.findOne({ activationToken });

    if (!user) {
      return res.status(404).json({ message: 'Invalid activation link' });
    }

    // Aktivoi käyttäjä ja tyhjennä aktivointitoken-kenttä
    user.active = true;
    user.activationToken = null;

    await user.save();

    return res.redirect('http://localhost:3000/activation-success'); 
  } catch (error) {
    console.error('Error activating account:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      // Etsi käyttäjä sähköpostiosoitteen perusteella
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Luo yksilöllinen token
      const resetToken = crypto.randomBytes(32).toString('hex');
  
      // Tallenna token käyttäjän tietoihin tietokantaan
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 900000; // 15 minuuttia
  
      await user.save();
  
      // Lähetä sähköposti käyttäjälle linkin kera
      sendResetPasswordEmail(email, resetToken);
  
      res.json({ message: 'Password reset link sent successfully' });
    } catch (error) {
      console.error('Error sending reset password email:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const resetPassword = async (req, res) => {
    const { resetToken } = req.params;
    const { newPassword } = req.body;
  
    try {
      // Etsi käyttäjä tokenin ja voimassaoloajan perusteella
      const user = await User.findOne({
        resetPasswordToken: resetToken,
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
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

module.exports = {
  activateAccount,
  forgotPassword,
  resetPassword,
};