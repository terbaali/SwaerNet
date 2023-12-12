import React, { useState } from 'react';

const ResetPassword = ({ setView, match }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPassword = async () => {
    
    if (password !== confirmPassword) {
      console.error('Passwords do not match');
      return;
    }

    if (password.length < 10 || !/[!@#$%^&*(),.?":{}|<>]/g.test(password)) {
      console.error('Password does not meet the requirements');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/reset-password/${match.params.token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Password reset successful:', data);
      } 
      else {
        console.error('Password reset failed:', data.message);
      }
    } 
    catch (error) {
      console.error('Error resetting password:', error.message);
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

      <button onClick={() => setView('login')}>Return to Log in</button>
    </div>
  );
};

export default ResetPassword;