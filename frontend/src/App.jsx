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

function App () {
  const [token, setToken] = React.useState(localStorage.getItem('token'));
  // Error handling
  const [errorOpen, setErrorOpen] = React.useState(init.errorOpen);
  const [errorMessage, setErrorMessage] = React.useState('');

  const setTokenToLocalStorage = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };

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
      <Snackbar open={errorOpen} autoHideDuration={6000} onClose={handleErrorClose}>
        <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
      <BrowserRouter>
        <Context.Provider value={{ getters, setters }}>
          {token &&
            <ResponsiveAppBar setLogout={() => logoutUser()} />
          }
          <Routes>
            {token &&
              <>
                <Route path="*" element={<Navigate replace to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard/> }/>
                <Route path="/editgame/:gameId" element={<EditGame/>} />
                <Route path="/editgame/:gameId/editquestion/:questionId" element={<EditQuestion onSuccess={() => console.log('success')} /> } />
                <Route path="/viewgame/:quizId/:sessionId" element={<ViewGame/> }/>
              </>
            }
            {!token &&
              <>
                <Route path="*" element={<Navigate replace to="/login" />} />
                <Route path="/login" element={<Login onSuccess={setTokenToLocalStorage} />} />
                <Route path="/register" element={<Register onSuccess={setTokenToLocalStorage}/>} />
              </>
            }
            <Route path="/play/:sessionId?" element={<PlayGame/> }/>
          </Routes>
        </Context.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
