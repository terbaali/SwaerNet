import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LogIn from './components/LogIn';
import Registration from './components/Registration';
import ForgotPassword from './components/ForgotPassword1';
import ResetPassword from './components/ResetPassword';  
import ActivateAccount from './components/ActivateAccount';
import Content from './components/Content';
import Cookies from 'universal-cookie';

const App = () => {
  const [banned, setBanned] = useState(false);

  const handleBanned = (status) => {
    setBanned(status);
  };

  useEffect(() => {
    const cookies = new Cookies();
    const banInfoCookie = cookies.get('banInfo');
    if (banInfoCookie) {
      try {
        if (banInfoCookie.banned && Date.now() < banInfoCookie.expires) {
          setBanned(true);
        }
      } 
      catch (error) {
        console.error('Error parsing banInfo cookie:', error.message);
      }
    }
  }, []);  

  return (
    <div>
      <BrowserRouter>
        <Routes>
          {banned ? (
            <Route path="*" element={<h1 style={{ fontSize: '3em', color: 'red' }}>UR BANNED GTFOH</h1>} />
          ) : (
            <>
              <Route path="/login" element={<LogIn onBanned={handleBanned} />} />
              <Route path="/content" element={<Content />} />
              <Route path="/registration" element={<Registration onBanned={handleBanned} />} />
              <Route path="/forgot-password" element={<ForgotPassword onBanned={handleBanned} />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/activate/:token" element={<ActivateAccount />} />
              {/* Default routing */}
              <Route path="*" element={<LogIn onBanned={handleBanned} />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;