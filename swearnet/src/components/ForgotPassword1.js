import React, { useState } from 'react';

const ForgotPassword = ({ setView }) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    try {
      const response = await fetch('http://localhost:3000/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Password reset link sent successfully:', data.message);
        setView('login')
      } 
      else {
        console.error('Error sending password reset link:', data.message);
      }
    } 
    catch (error) {
      console.error('Error sending password reset link:', error.message);
    }
  };

  return (
    <div>
      <h1>SwearNet</h1>
      <h2>Forgot Password</h2>
      <form>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <button type="button" onClick={handleResetPassword}>Reset Password</button>
      </form>

      <div>
        <button onClick={() => setView('login')}>Return to Login</button>
      </div>
    </div>
  );
};

export default ForgotPassword;