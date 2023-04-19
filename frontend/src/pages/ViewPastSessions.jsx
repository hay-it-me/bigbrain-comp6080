import React from 'react';
import { useContext, Context } from '../context';
import { Link, useParams } from 'react-router-dom';
import { apiRequest } from '../utilities/helpers';
import { Button, Grid, Typography } from '@mui/material';

export const ViewPastSessions = () => {
  const { getters, setters } = useContext(Context);
  // Use params to get id
  const { quizId } = useParams();
  const [sessions, setSessions] = React.useState([]);
  const [quizName, setQuizName] = React.useState('');
  React.useEffect(async () => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${getters.token}`
      }
    }
    const data = await apiRequest('/admin/quiz/' + quizId, options);
    if (data.error === 'Invalid token') localStorage.removeItem('token')
    if (data.error) {
      setters.setErrorMessage(data.error)
      setters.setErrorOpen(true);
    } else {
      // Set quiz name and session numbers
      setSessions(data.oldSessions)
      setQuizName(data.name)
    }
  }, [])
  return (
    <main>
      <header>
        <Typography variant='h5' textAlign='center'>Past sessions for quiz: {quizName}</Typography>
      </header>
      <section aria-label="Game Sessions">
        <Grid container alignItems="center" direction="column" justifyContent="center">
          {/* map all buttons linking to viewgame link to see the results */}
          {sessions.map((session) => {
            return (
              <Grid item key={'session-' + session}>
                <Button variant="contained" component={Link} to={'/viewgame/' + quizId + '/' + session} sx={{ m: 1 }} aria-label={'view-session-' + session} >View Sesssion {session}</Button>
              </Grid>
            )
          })}
        </Grid>
      </section>
      <footer>
        <Typography variant="subtitle2" align="center" sx={{ m: 5 }}>
          © 2023 VENTRICOLUMNA
        </Typography>
      </footer>
    </main>
  )
}
