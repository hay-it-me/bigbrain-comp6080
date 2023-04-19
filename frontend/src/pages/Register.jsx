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
  // Snackbar,
  // Alert
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import React from 'react';
import { Link } from 'react-router-dom';
import { useContext, Context } from '../context';

export const Register = ({ onSuccess }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [name, setName] = React.useState('');
  // const [getters.errorOpen, setters.setErrorOpen] = React.useState(false);
  // const [getters.errorMessage, setters.setErrorMessage] = React.useState('');
  const { setters } = useContext(Context);
  // console.log(getters)
  async function registerUser () {
    if (password !== confirmPassword) {
      setters.setErrorMessage('Passwords do not match');
      setters.setErrorOpen(true);
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
      setters.setErrorMessage(data.error);
      setters.setErrorOpen(true);
    } else {
      onSuccess(data.token);
    }
  }

  // const handleErrorClose = (event, reason) => {
  //   if (reason === 'clickaway') {
  //     return;
  //   }
  //   setters.setErrorOpen(false);
  // };

  const registerCard = (
    <React.Fragment>
      <CardContent>
        <header>
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
        </header>
        <section>
          <Typography variant="h5" id="register-section" sx={{ mt: 2 }}>Register</Typography>
          <div>
            <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
              <InputLabel htmlFor="register-name">Name</InputLabel>
              <Input
                id="register-name"
                name="name"
                value={name}
                type="text"
                onChange={(event) => {
                  setName(event.target.value);
                }}
                aria-label="Name"
              />
            </FormControl>
          </div>
          <div>
            <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
              <InputLabel htmlFor="register-email">Email</InputLabel>
              <Input
                id="register-email"
                name="email"
                value={email}
                type="email"
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
                aria-label="Email"
              />
            </FormControl>
          </div>
          <div>
            <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
              <InputLabel htmlFor="register-password">Password</InputLabel>
              <Input
                id="register-password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
                aria-label="Password"
              />
            </FormControl>
          </div>
          <div>
            <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
              <InputLabel htmlFor="register-password-confirm">Confirm Password</InputLabel>
              <Input
                id="register-password-confirm"
                name="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                }}
                aria-label="Confirm Password"
              />
            </FormControl>
          </div>
        </section>
        <Button sx={{ mt: 1, mb: 1 }} id="register-button" onClick={registerUser} aria-label="Register Account">Register Account</Button>
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
      {/* <Snackbar open={getters.errorOpen} autoHideDuration={6000} onClose={handleErrorClose}>
        <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
          {getters.errorMessage}
        </Alert>
      </Snackbar> */}
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
