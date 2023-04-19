import { useContext, Context } from '../context';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { apiRequest } from '../utilities/helpers'
import { BarChart, XAxis, YAxis, Bar, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts'
export const ViewGame = () => {
  const { getters, setters } = useContext(Context);
  const [active, setActive] = React.useState(true);
  const [rerenderScreen, setRerenderScreen] = React.useState(false);
  const [correct, setCorrect] = React.useState([]);
  const [time, setTime] = React.useState([]);
  const [userPoints, setUserPoints] = React.useState([{
    user: '',
    points: 0
  }]);
  const { quizId, sessionId } = useParams();

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
    }
  }, [rerenderScreen]);
  const generateResults = (data, quizData) => {
    let userPointData = [];
    const correctData = [];
    const time = [];
    data.forEach((user) => {
      let points = 0;
      user.answers.forEach((answer, index) => {
        if (correctData[index] === undefined) correctData[index] = { question: 'Q' + (index + 1), correct: 0 };
        if (time[index] === undefined) time[index] = { question: 'Q' + (index + 1), time: 0 };
        if (answer.correct) {
          correctData[index].correct++;
          points += Number(quizData.questions[index].points)
        }
        if (answer.answeredAt) {
          const start = Date.parse(answer.questionStartedAt);
          const end = Date.parse(answer.answeredAt);
          time[index].time += ((end - start) / 1000);
        } else {
          time[index].time += quizData.questions[index].timelimit;
        }
      })
      userPointData = ([...userPointData, { user: user.name, points }])
    })
    userPointData.sort((a, b) => b.points - a.points)
    setUserPoints(userPointData);
    setCorrect(correctData.map((datapoint) => {
      return { question: datapoint.question, correct: datapoint.correct * 100 / data.length }
    }));
    setTime(time.map((datapoint) => {
      return { question: datapoint.question, time: datapoint.time / data.length }
    }))
  }
  React.useEffect(async () => {
    if (!active) {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${getters.token}`
        }
      }
      const data = await apiRequest('/admin/session/' + sessionId + '/results', options);
      if (data.error) {
        setters.setErrorMessage(data.error)
        setters.setErrorOpen(true);
      } else {
        const quizData = await apiRequest('/admin/quiz/' + quizId, options);
        if (quizData.error) {
          setters.setErrorMessage(data.error)
          setters.setErrorOpen(true);
        }
        generateResults(data.results, quizData);
      }
    }
  }, [active])

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
    }
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
  }

  return (
    <main>
      <section aria-label="Game Container">
        <Grid container alignItems="center" direction="column" justifyContent="center" sx={{ width: '100%' }}>
          {active && <header><Typography variant="h4">Game In Progress!</Typography></header>}
          {active && <Button
            sx={{ marginTop: '30px' }}
            variant="outlined"
            onClick={advanceGame}
            aria-label="Next Question"
          >
            Next Question
          </Button>}
          {active && <Button
            sx={{ marginTop: '30px' }}
            variant="outlined"
            onClick={endGame}
            aria-label="End Game"
          >
            End Game
          </Button>}
          {!active &&
            <Grid item xs={12} sm={10} md={8} sx={{ textAlign: 'center', width: '95%' }}>
              <header>
                <Typography variant="h3">Results</Typography>
                <br />
                <Typography variant="h4">Top Players</Typography>
              </header>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell align="right">Points</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userPoints.slice(0, 5).map((data, index) => {
                      return (
                        <TableRow key={data.user + '-' + index}>
                          <TableCell>{data.user}</TableCell>
                          <TableCell align='right'>{data.points}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <header>
                <Typography variant="h4">Percentage Correct</Typography>
              </header>
              <ResponsiveContainer width="95%" height={500} role="figure" aria-label="Percentage Correct">
                <BarChart title='% Correct' data={correct}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey='question' aria-label="Questions" interval={0} />
                  <YAxis aria-label="Percentage" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='correct' fill='#008800' />
                </BarChart>
              </ResponsiveContainer>
              <header>
                <Typography variant="h4">Average Time Taken (seconds)</Typography>
              </header>
              <ResponsiveContainer width="95%" height={500} role="figure" aria-label="Average Time Taken">
                <BarChart title='% Correct' data={time}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey='question' aria-label="Questions" interval={0} />
                  <YAxis aria-label="Seconds" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='time' fill='#ebc333' />
                </BarChart>
              </ResponsiveContainer>
            </Grid>
          }
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
