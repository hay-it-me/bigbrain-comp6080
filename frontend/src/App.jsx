import React from 'react';
import {
  Snackbar,
  Alert
} from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { Context, init } from './context';
// Helpers
import { apiRequest } from './utilities/helpers'
// Components

// Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Quizzes } from './pages/Quizzes';
import { EditGame } from './pages/EditGame';

import ResponsiveAppBar from './components/Navbar';
import { ViewGame } from './pages/ViewGame';

function App () {
  const [token, setToken] = React.useState(localStorage.getItem('token'));
  // Error handling
  const [errorOpen, setErrorOpen] = React.useState(init.errorOpen);
  const [errorMessage, setErrorMessage] = React.useState('');
  function setTokenToLocalStorage (token) {
    setToken(token);
    localStorage.setItem('token', token);
  }
  const getters = {
    token,
    errorOpen,
    errorMessage
  };
  const setters = {
    setTokenToLocalStorage,
    setErrorOpen,
    setErrorMessage
  };

  async function logoutUser () {
    setToken(null);
    localStorage.removeItem('token');
    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({})
    };
    const data = await apiRequest('admin/auth/logout', options);
    if (data.error) {
      setErrorMessage(data.error);
      setErrorOpen(true);
    }
  }

  const handleErrorClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorOpen(false);
  };

  if (!token) {
    return (
      <>
        <BrowserRouter>
          <Context.Provider value={{ getters, setters }}>
            <Routes>
              <Route path="*" element={<Navigate replace to="/login" />} />
              <Route path="/login" element={<Login onSuccess={setTokenToLocalStorage} />} />
              <Route path="/register" element={<Register onSuccess={setTokenToLocalStorage}/>} />
            </Routes>
          </Context.Provider>
        </BrowserRouter>
      </>
    );
  } else {
    return (
      <>
        <Snackbar open={errorOpen} autoHideDuration={6000} onClose={handleErrorClose}>
          <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
            {errorMessage}
          </Alert>
        </Snackbar>
        <BrowserRouter>
          <Context.Provider value={{ getters, setters }}>
            <ResponsiveAppBar setLogout={() => logoutUser()} />
            <Routes>
              <Route path="*" element={<Navigate replace to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard/> }/>
              <Route path="/editgame/:gameId" element={<EditGame/>} />
              <Route path="/quizzes" element={<Quizzes/> }/>
              <Route path="/viewgame/:sessionId" element={<ViewGame/> }/>
            </Routes>
          </Context.Provider>
        </BrowserRouter>
      </>
    );
  }
}

export default App;
