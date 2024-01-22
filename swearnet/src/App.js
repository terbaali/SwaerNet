import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LogIn from './components/LogIn';
import Registration from './components/Registration';
import ForgotPassword from './components/ForgotPassword1';
import ResetPassword from './components/ResetPassword';
import ActivateAccount from './components/ActivateAccount';
import Content from './components/Content';
import './App.css';

export const AuthContext = createContext();

const App = () => {
  const [banned, setBanned] = useState(false);
  const [token, setToken] = useState('');
  const [logedin, setLogedin] = useState(false);

  const handleBanned = (status) => {
    setBanned(status);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token') || '';
    if (token) {
      console.log('terve');
      console.log(token);
      setToken(token);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ logedin }}>
      <div>
        <BrowserRouter>
          <Routes>
            {banned ? (
              <Route path="*" element={<h1 style={{ fontSize: '3em', color: 'red' }}>UR BANNED GTFOH</h1>} />
            ) : token !== '' ? (
              <Route path="*" element={<ResetPassword token={token} />} />
            ) : (
              <>
                <Route path="/login" element={<LogIn onBanned={handleBanned} setLogedin={setLogedin}/>} />
                <Route path="/" element={<Content onBanned={handleBanned} logedin={logedin} setLogedin={setLogedin}/>} />
                <Route path="/registration" element={<Registration onBanned={handleBanned} />} />
                <Route path="/forgot-password" element={<ForgotPassword onBanned={handleBanned} />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/activate/:token" element={<ActivateAccount />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  );
};

export default App;
