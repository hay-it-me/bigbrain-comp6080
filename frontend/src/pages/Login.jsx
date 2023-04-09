import {
  FormControl,
  InputLabel,
  Input,
  Grid,
  Button,
  Typography,
  Box,
  Card,
  CardContent
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import React from 'react';
import { Link } from 'react-router-dom';

export const Login = ({ onSuccess }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

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
    onSuccess(data.token);
  }

  const loginCard = (
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
            <InputLabel htmlFor="login-email">Email</InputLabel>
            <Input
              id="login-username"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </FormControl>
        </div>
        <div>
          <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
            <InputLabel htmlFor="login-password">Password</InputLabel>
            <Input
              id="login-password"
              label="Password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </FormControl>
        </div>
        <Button sx={{ mt: 1, mb: 1 }} onClick={loginUser}>Log In</Button>
        <div>
          <Typography component="subtitle2" >
            Don&apos;t have an account? Create one <Link to="/Register">here</Link>
          </Typography>
        </div>
      </CardContent>
    </React.Fragment>
  )

  return (
    <>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ mt: 5, minWidth: 275 }}>
            <Card variant="outlined">{loginCard}</Card>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}
