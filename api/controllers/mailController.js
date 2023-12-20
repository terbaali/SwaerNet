const nodemailer = require('nodemailer');
require('dotenv').config();

const sendActivationEmail = (email, token) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
  });

  const activationLink = `http://localhost:3000/users/activate/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'SwearNet account Activation',
    text: `Click on the following link to activate your account: ${activationLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending activation email:', error);
    } 
    else {
      console.log('Activation email sent:', info.response);
    }
  });
};

const sendResetPasswordEmail = (email, resetToken) => {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
  
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Your Password',
      text: `Click on the following link to reset your password: ${resetLink}`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending reset password email:', error);
      } 
      else {
        console.log('Reset password email sent:', info.response);
      }
    });
  };

module.exports = {
  sendActivationEmail,
  sendResetPasswordEmail,
};