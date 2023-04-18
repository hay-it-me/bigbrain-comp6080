import { useContext, Context } from '../context';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Button, Grid, Typography } from '@mui/material';
import { apiRequest } from '../utilities/helpers'

export const ViewGame = () => {
  const { getters, setters } = useContext(Context);
  const [active, setActive] = React.useState(false);
  const [rerenderScreen, setRerenderScreen] = React.useState(false);

  const { quizId, sessionId } = useParams();

  // console.log(getters, setters, sessionId, quizId);

  const rerender = () => {
    setRerenderScreen(!rerenderScreen);
  }

  React.useEffect(async () => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${getters.token}`
      }
    }
    const data = await apiRequest('/admin/session/' + sessionId + '/status', options);
    if (data.error) {
      setters.setErrorMessage(data.error)
      setters.setErrorOpen(true);
    } else if (data.results.active) {
      setActive(true);
    } else {
      setActive(false);
      const res = await apiRequest('/admin/session/' + sessionId + '/status', options);
      if (res.error) {
        setters.setErrorMessage(data.error)
        setters.setErrorOpen(true);
      } else {
        console.log('results')
      }
    }
  }, [rerenderScreen]);
  // displaySession();

  const endGame = async () => {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${getters.token}`
      }
    };
    const data = await apiRequest('/admin/quiz/' + quizId + '/end', options);
    if (data.error) {
      setters.setErrorMessage(data.error)
      setters.setErrorOpen(true);
    } else {
      rerender();
      // console.log('ended')
    }
    // TODO
  }

  const advanceGame = async () => {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${getters.token}`
      }
    };
    const data = await apiRequest('/admin/quiz/' + quizId + '/advance', options);
    if (data.error) {
      setters.setErrorMessage(data.error)
      setters.setErrorOpen(true);
    } else {
      rerender();
    }
    // TODO
  }

  return (
    <>
      <Grid container alignItems="center" direction="column" justifyContent="center">
        {active && <Typography variant="h4">Game In Progress!</Typography>}
        {active && <Button
          sx={{ marginTop: '30px' }}
          variant="outlined"
          onClick={advanceGame}
        >
        Next Question
        </Button>}
        {active && <Button
          sx={{ marginTop: '30px' }}
          variant="outlined"
          onClick={endGame}
        >
        End Game
        </Button>}
        {/* INSERT RESULTS STUFF FOR PLAYERS */}
        {/* <Grid item>
        </Grid>
        <Grid item>
        </Grid>
        <Grid item>
        </Grid> */}
      </Grid>
    </>
  )
}
