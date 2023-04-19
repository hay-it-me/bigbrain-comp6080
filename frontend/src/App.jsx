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
import ResponsiveAppBar from './components/Navbar';
// Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { EditGame } from './pages/EditGame';
import { EditQuestion } from './pages/EditQuestion';
import { ViewGame } from './pages/ViewGame';
import { PlayGame } from './pages/PlayGame';
import { ViewPastSessions } from './pages/ViewPastSessions';

function App () {
  // Initial token is grabbed from localStorage
  const [token, setToken] = React.useState(localStorage.getItem('token'));
  // Error handling
  const [errorOpen, setErrorOpen] = React.useState(init.errorOpen);
  const [errorMessage, setErrorMessage] = React.useState('');
  // Token setter
  const setTokenToLocalStorage = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };
  // getters and setters for global state variables to be provided through context
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
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    };
    const data = await apiRequest('/admin/auth/logout', options);
    if (data.error === 'Invalid token') localStorage.removeItem('token')
    if (data.error) {
      setErrorMessage(data.error);
      setErrorOpen(true);
    } else {
      localStorage.removeItem('token');
      setToken(null);
    }
  }

  const handleErrorClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorOpen(false);
  };

  return (
    <>
      {/* Snackbar displayed everywhere which handles errors */}
      <Snackbar open={errorOpen} autoHideDuration={6000} onClose={handleErrorClose} aria-label="Error message">
        <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
      <BrowserRouter>
        <Context.Provider value={{ getters, setters }}>
          {/* Navbar displays when we are logged in */}
          {token &&
            <ResponsiveAppBar setLogout={() => logoutUser()} role="navigation" aria-label="App navigation bar" />
          }
          <Routes>
            {/* Routes for logged in users */}
            {token &&
              <>
                <Route path="*" element={<Navigate replace to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard role="main" aria-label="Dashboard" />} />
                <Route path="/editgame/:gameId" element={<EditGame role="main" aria-label="Edit game page" />} />
                <Route path="/editgame/:gameId/editquestion/:questionId" element={<EditQuestion onSuccess={() => console.log('success')} role="main" aria-label="Edit question page" />} />
                <Route path="/viewgame/:quizId/:sessionId" element={<ViewGame role="main" aria-label="View game page" />} />
                <Route path="/viewpastsessions/:quizId" element={<ViewPastSessions role="main" aria-label="View past sessions page" />} />
              </>
            }
            {/* Routes for not logged in users */}
            {!token &&
              <>
                <Route path="*" element={<Navigate replace to="/login" />} />
                <Route path="/login" element={<Login onSuccess={setTokenToLocalStorage} role="main" aria-label="Login page" />} />
                <Route path="/register" element={<Register onSuccess={setTokenToLocalStorage} role="main" aria-label="Register page" />} />
              </>
            }
            {/* Global play game route */}
            <Route path="/play/:sessionId?" element={<PlayGame role="main"/> }/>
          </Routes>
        </Context.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
