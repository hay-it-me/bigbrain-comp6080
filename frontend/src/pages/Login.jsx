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
import { FlexDiv } from '../utilities/helpers';

export const Login = ({ onSuccess }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  // const [getters.errorOpen, setters.setErrorOpen] = React.useState(false);
  // const [getters.errorMessage, setters.setErrorMessage] = React.useState('');
  const { setters } = useContext(Context);

  async function loginUser () {
    const response = await fetch('http://localhost:5005/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
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

  const loginCard = (
    <React.Fragment>
      <header role="banner">
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
        </CardContent>
      </header>
      <main role="main">
        <section aria-labelledby="login-section">
          <Typography variant="h5" id="login-section" sx={{ ml: 2 }}>Login</Typography>
          <div>
            <FormControl variant="standard" fullWidth sx={{ ml: 2 }}>
              <InputLabel htmlFor="login-email">Email</InputLabel>
              <Input
                id="login-email"
                value={email}
                type="email"
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
                aria-label="Email"
                required
              />
            </FormControl>
          </div>
          <div>
            <FormControl variant="standard" fullWidth sx={{ ml: 2 }}>
              <InputLabel htmlFor="login-password">Password</InputLabel>
              <Input
                id="login-password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
                aria-label="Password"
                required
              />
            </FormControl>
          </div>
          <Button sx={{ m: 2 }} onClick={loginUser}>Log In</Button>
        </section>
        <aside role="complementary">
          <Typography variant="subtitle2" sx={{ ml: 2 }}>
            Don&apos;t have an account? Create one <Link to="/register">here</Link>
          </Typography>
        </aside>
      </main>
      <footer role="contentinfo">
        <CardContent>
          <Typography variant="caption">
            &copy; 2023 VENTRICOLUMNA
          </Typography>
        </CardContent>
      </footer>
    </React.Fragment>
  );

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
        role="presentation"
      >
        <Grid item xs={8} sm={9} md={10}>
          <Box sx={{ mt: 5, minWidth: 275 }}>
            <Card variant="outlined">{loginCard}</Card>
          </Box>
        </Grid>
      </Grid>
      <div role="navigation">
        <FlexDiv sx={{ flexDirection: 'column' }}>
          <Typography variant='h5'>Or</Typography>
          <Typography variant='h4'><Link to="/play">Join a Game</Link></Typography>
        </FlexDiv>
      </div>
    </>
  );
}
