import React, { useState } from 'react';
import { hashPassword } from './pwHasher';

const Login = ({ setView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const hashedPassword = await hashPassword(password);

      const response = await fetch('http://localhost:3000/login', {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: hashedPassword }), 
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        // Lisää tässä kohtaa tarvittavat toimenpiteet, esim. käyttäjän tilan päivitys ja siirtyminen eteenpäin
      } 
      else {
        console.error('Login failed:', data.message);
      }
    } 
    catch (error) {
      console.error('Error logging in:', error.message);
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

        <button type="button" onClick={handleLogin}>Login</button>
      </form>

      <div>
        <button onClick={() => setView('registration')}>Register</button>
        <button onClick={() => setView('forgotPw')}>Forgot Password</button>
      </div>
    </div>
  );
};

export default Login;