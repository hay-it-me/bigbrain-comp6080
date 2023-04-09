import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ResponsiveAppBar from './components/Navbar';

import { Login } from './pages/Login';

function App () {
  const [token, setToken] = React.useState(localStorage.getItem('token'));

  function setTokenToLocalStorage (token) {
    setToken(token);
    localStorage.setItem('token', token)
  }

  if (!token) {
    return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login onSuccess={setTokenToLocalStorage} />} />
            {/* <Route path="/register" element={<Register />} /> */}
          </Routes>
        </BrowserRouter>
      </>
    );
  } else {
    return (
      <>
        <ResponsiveAppBar />
        <BrowserRouter>
          <Routes>
            {/* <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} /> */}
          </Routes>
        </BrowserRouter>
      </>
    );
  }
}

export default App;
