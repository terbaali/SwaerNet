import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { hashPassword } from './pwHasher';
import DOMPurify from 'dompurify';

const Registration = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegistration = async () => {
    try {
      if (!username || !email || !password || !confirmPassword) {
        alert('All fields are required.');
        return;
      }

      if (!passwordsMatch()) {
        alert('Passwords do not match');
        return;
      }

      if (!validatePassword()) {
        alert('Password does not meet the requirements, must be over 10 characters and minimum of 1 special character');
        return;
      }

      const sanitizedUsername = sanitizeInput(username);
      const sanitizedEmail = sanitizeInput(email);

      const hashedPassword = await hashPassword(password);

      const response = await fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: sanitizedUsername, email: sanitizedEmail, password: hashedPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful. Please log in.');
        // Redirect to the login page
        window.location.href = '/login';
      } else {
        alert('Registration failed:', data.message);
      }
    } catch (error) {
      alert('Error registering:', error.message);
    }
  };

  const validatePassword = () => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,}$/;
    return regex.test(password);
  };

  const passwordsMatch = () => {
    return password === confirmPassword;
  };

  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input); 
  };

  return (
    <div>
      <h1>SwearNet</h1>
      <h2>Registration</h2>
      <form>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />

        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="button" onClick={handleRegistration}>
          Register
        </button>
      </form>
      <div>
        <Link to="/login">
          <button>Return to login</button>
        </Link>
      </div>
    </div>
  );
};

export default Registration;