import React, { useEffect } from 'react';

const ActivateAccount = ({ setView, match }) => {
  useEffect(() => {
    
    const activateAccount = async () => {
      try {
        const response = await fetch(`http://localhost:3000/activate/${match.params.token}`, {
          method: 'GET',
        });

        const data = await response.json();

        if (response.ok) {
          console.log('Account activation successful:', data);
        } 
        else {
          console.error('Account activation failed:', data.message);
        }
      } 
      catch (error) {
        console.error('Error activating account:', error.message);
      }
    };

    activateAccount();
  }, [match.params.token]);

  return (
    <div>
      <h1>SwearNet</h1>
      <h2>Account Activated</h2>
      <p>Your account is now activated. You can log in with your credentials.</p>
      <button onClick={() => setView('login')}>Log in</button>
    </div>
  );
};

export default ActivateAccount;