import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { hashPassword } from './pwHasher';

const ResetPassword = (token) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();
  
  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (password.length < 10 || !/[!@#$%^&*(),.?":{}|<>]/g.test(password)) {
      alert('Password does not meet the requirements, must be over 10 characters and minimum of 1 special character');
      return;
    }

    try {
      const hashedPassword = await hashPassword(password);
      const response = await fetch(`http://localhost:3000/auth/reset-password/${token.token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword: hashedPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Password reset successful:');
        navigate('/');
      } 
      else {
        alert('Password reset failed:', data.message);
      }
    } 
    catch (error) {
      alert('Error resetting password:', error.message);
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <label>Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <label>Confirm Password:</label>
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <button type="button" onClick={handleResetPassword}>
        Reset Password
      </button>

      <p>
        {/* Mahdollista ulinaa käyttäjälle */}
      </p>
      <Link to="/login">
        <button>To Log in</button>
      </Link>
    </div>
  );
};

export default ResetPassword;