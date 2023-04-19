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
  // const [results, setResults] = React.useState([{
  //   name: '',
  //   answers: [{
  //     questionStartedAt: '',
  //     answeredAt: '',
  //     answerIds: [],
  //     correct: false
  //   }]
  // }])
  const { quizId, sessionId } = useParams();

  // console.log(Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, BarChart, XAxis, YAxis, Bar, Tooltip, Legend, CartesianGrid, correct, time, userPoints);

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
  // displaySession();
  const generateResults = (data, quizData) => {
    let userPointData = [];
    const correctData = [];
    const time = [];
    // setResults(data);
    data.forEach((user) => {
      let points = 0;
      user.answers.forEach((answer, index) => {
        if (correctData[index] === undefined) correctData[index] = { question: 'Question ' + (index + 1), correct: 0 };
        if (time[index] === undefined) time[index] = { question: 'Question ' + (index + 1), time: 0 };
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
      // console.log('ended')
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
    // <>
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
      {!active &&
        <Grid item xs={12} sm={6} md={8} style={{ textAlign: 'center' }}>
          <Typography variant="h3">Results</Typography><br />
          <Typography variant="h4">Top Players</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell align="right" >Points</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userPoints.slice(0, 5).map(data => {
                  return (
                    <TableRow key={data}>
                      <TableCell>{data.user}</TableCell>
                      <TableCell align='right'>{data.points}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="h4">Percentage Correct</Typography>
          <ResponsiveContainer width="90%" height={500}>
            <BarChart title='% Correct' data={correct}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey='question'>
              </XAxis>
              <YAxis>
              </YAxis>
              <Tooltip />
              <Legend />
              <Bar dataKey='correct' fill='#008800' />
            </BarChart>
          </ResponsiveContainer>
          <Typography variant="h4">Average Time Taken (seconds) </Typography>
          <ResponsiveContainer width="90%" height={500}>
            <BarChart title='% Correct' data={time}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey='question'>
              </XAxis>
              <YAxis>
              </YAxis>
              <Tooltip />
              <Legend />
              <Bar dataKey='time' fill='#ebc333' />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      }
    </Grid>
    // {/* </> */}
  )
}
