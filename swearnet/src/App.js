import React, { useState } from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom'

import LogIn from './components/LogIn';
import Registration from './components/Registration';
import ForgotPassword from './components/ForgotPassword1';
import ResetPassword from './components/ResetPassword';  
import ActivateAccount from './components/ActivateAccount';
import Content from './components/Content'; 

const App = () => {
  const [token, setToken] = useState(null);
  //const navigate = useNavigate();

  //const handleNavigation = (targ et) => {
  //  navigate(target);
  //};

  const handleLogin = (userToken) => {
    setToken(userToken);
    //navigate('/content');
  };





  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LogIn onLogin={handleLogin} />} /> 
          <Route path="/content" element={<Content token={token}/>} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/activate/:token" element={<ActivateAccount />}  />
          {/* Default routing */}
          <Route path="*" element={<LogIn onLogin={handleLogin} />}  />
        </Routes>
      </BrowserRouter>
    </div> 
  );
};

export default App;

