import React, { useState } from 'react';
import { hashPassword } from './pwHasher';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        alert('Email and password are required.');
        return;
      }

      const hashedPassword = await hashPassword(password);

      const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: hashedPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem('token', data.token);
        //onLogin(data.token);
        navigate('/content');
      } else {
        alert('Login failed:', data.message);
      }
    } 
    catch (error) {
      alert('Error logging in:', error.message);
    }
  };

  return (
    <div>
      <h1>SwearNet</h1>
      <h2>Login</h2>
      <form>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>

      <div>
        <Link to="/registration">
          <button>Register</button>
        </Link>
        <Link to="/forgot-password">
          <button>Forgot Password</button>
        </Link>
      </div>
    </div>
  );
};

export default Login;