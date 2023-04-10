import {
  FormControl,
  InputLabel,
  Input,
  Grid,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Snackbar,
  Alert
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Register = ({ onSuccess }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [errorOpen, setErrorOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  async function registerUser () {
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setErrorOpen(true);
      return;
    }

    const response = await fetch('http://localhost:5005/admin/auth/register', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        name
      })
    });

    const data = await response.json();
    if (data.error) {
      setErrorMessage(data.error);
      setErrorOpen(true);
    } else {
      onSuccess(data.token);
      const navigate = useNavigate();
      navigate('/dashboard');
    }
  }

  const handleErrorClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorOpen(false);
  };

  const registerCard = (
    <React.Fragment>
      <CardContent>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
          <SchoolIcon sx={{ mr: 1 }} />
          <Typography component="h3">
            Big Brain
          </Typography>
        </div>
        <div>
          <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
            <InputLabel htmlFor="register-name">Name</InputLabel>
            <Input
              id="register-name"
              value={name}
              type="text"
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
          </FormControl>
        </div>
        <div>
          <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
            <InputLabel htmlFor="register-email">Email</InputLabel>
            <Input
              id="register-email"
              value={email}
              type="email"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </FormControl>
        </div>
        <div>
          <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
            <InputLabel htmlFor="register-password">Password</InputLabel>
            <Input
              id="register-password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </FormControl>
        </div>
        <div>
          <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
            <InputLabel htmlFor="register-password-confirm">Confirm Password</InputLabel>
            <Input
              id="register-password-confirm"
              type="password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
              }}
            />
          </FormControl>
        </div>
        <Button sx={{ mt: 1, mb: 1 }} onClick={registerUser}>Register Account</Button>
        <div>
          <Typography variant="subtitle2" >
            Already have an account? Log in <Link to="/login">here</Link>
          </Typography>
        </div>
      </CardContent>
    </React.Fragment>
  )

  return (
    <>
      <Snackbar open={errorOpen} autoHideDuration={6000} onClose={handleErrorClose}>
        <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ mt: 5, minWidth: 275 }}>
            <Card variant="outlined">{registerCard}</Card>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}
