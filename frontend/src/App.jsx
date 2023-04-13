import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
// Components

// Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Quizzes } from './pages/Quizzes';

function App () {
  const [token, setToken] = React.useState(localStorage.getItem('token'));

  function setTokenToLocalStorage (token) {
    setToken(token);
    localStorage.setItem('token', token);
    const navigate = useNavigate();
    navigate('/dashboard');
  }

  function logoutUser () {
    setToken(null);
    localStorage.removeItem('token');
    const navigate = useNavigate();
    navigate('/login');
  }

  if (!token) {
    return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login onSuccess={setTokenToLocalStorage} />} />
            <Route path="/login" element={<Login onSuccess={setTokenToLocalStorage} />} />
            <Route path="/register" element={<Register onSuccess={setTokenToLocalStorage}/>} />
          </Routes>
        </BrowserRouter>
      </>
    );
  } else {
    return (
      <>
        {console.log(token)}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate replace to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard onLogout={logoutUser} token={token} /> }/>
            <Route path="/quizzes" element={<Quizzes onLogout={logoutUser} /> }/>
          </Routes>
        </BrowserRouter>
      </>
    );
  }
}

export default App;
