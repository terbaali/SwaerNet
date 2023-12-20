import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    try {
      if (!email) {
        alert('Email is required.');
        return;
      }

      const response = await fetch('http://localhost:3000/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Password reset link sent successfully: ' + data.message);
        navigate('/login');
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Error sending password reset link: ' + error.message);
    }
  };

  return (
    <div>
      <h1>SwearNet</h1>
      <h2>Forgot Password</h2>
      <form>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <button type="button" onClick={handleResetPassword}>
          Reset Password
        </button>
      </form>

      <div>
        <Link to="/login">
          <button>Return to Login</button>
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;