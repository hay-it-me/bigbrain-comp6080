import { Button, CircularProgress, Grid, Typography } from '@mui/material';
import React from 'react';
import { useContext, Context } from '../context';
import { useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField/TextField';
import { apiRequest } from '../utilities/helpers';

export const PlayGame = () => {
  const { getters, setters } = useContext(Context);
  const [playerId, setPlayerId] = React.useState('');
  const [sessionId, setSessionId] = React.useState('');
  const [name, setName] = React.useState('');
  const params = useParams();
  React.useEffect(() => {
    if (params) {
      setSessionId(params.sessionId);
      console.log(params.sessionId)
    }
  }, []);
  console.log(getters, setters, sessionId);

  const joinGame = async () => {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name
      })
    };
    const data = await apiRequest('/play/join/' + sessionId, options);
    if (data.error) {
      setters.setErrorMessage(data.error)
      setters.setErrorOpen(true);
    } else {
      setPlayerId(data.playerId);
    }
  }

  return (
    <>
      <Grid container alignItems="center" direction="column" justifyContent="center">
        {!playerId &&
          <>
            <TextField
              sx={{ margin: '10px' }}
              id="session-code"
              label="Session Code"
              variant='outlined'
              value={sessionId}
              onChange={(event) => {
                setSessionId(event.target.value)
              }}
            />
            <TextField
              sx={{ margin: '10px' }}
              id="player-name"
              label="Enter Your Name"
              variant='outlined'
              value={name}
              onChange={(event) => {
                setName(event.target.value)
              }}
            />
            <Button
              variant="outlined"
              onClick={joinGame}
            >
              Join Game
            </Button>
          </>
        }
        {playerId &&
          <>
            <Typography variant="h4">Wating to start</Typography>
            <CircularProgress />
          </>
        }
      </Grid>
    </>
  )
}
