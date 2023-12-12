import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Login from './components/LogIn1';
import Registration from './components/Registration';
import ForgotPassword from './components/ForgotPassword1';
import ResetPassword from './components/ResetPassword';  
import ActivateAccount from './components/ActivateAccount';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/registration" component={Registration} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password/:token" component={ResetPassword} />
        <Route path="/activate/:token" component={ActivateAccount} />
      </Switch>
    </Router>
  );
};

export default App;