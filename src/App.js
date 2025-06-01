import React, { useState } from 'react';
import Login from './Login';
import Home from './Home'; // your employee dashboard

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      {isLoggedIn ? <Home /> : <Login onLogin={() => setIsLoggedIn(true)} />}
    </div>
  );
}

export default App;
