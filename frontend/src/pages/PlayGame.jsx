import { Box, Button, Card, CardContent, Checkbox, CircularProgress, FormControlLabel, Grid, Typography } from '@mui/material';
import React from 'react';
import { useContext, Context } from '../context';
import { useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField/TextField';
import { apiRequest } from '../utilities/helpers';
import ReactPlayer from 'react-player';
// import TimeComponent from '../components/TimeComponent';

export const PlayGame = () => {
  const { setters } = useContext(Context);
  const [playerId, setPlayerId] = React.useState('');
  const [sessionId, setSessionId] = React.useState('');
  const [name, setName] = React.useState('');
  const [started, setStarted] = React.useState(false);
  const [ended, setEnded] = React.useState(false);
  const [question, setQuestion] = React.useState({
    question: '',
    type: '',
    answers: [],
    timelimit: 0,
    points: 0,
    videourl: 'url',
    photosrc: 'src',
    isoTimeLastQuestionStarted: '',
  });
  // const [timeRemaining, setTimeRemaining] = React.useState(100);
  // const [progress, setProgress] = React.useState(0);
  const [allowed, setAllowed] = React.useState(true);
  const [selected, setSelected] = React.useState([]);
  const [correct, setCorrect] = React.useState([]);
  const [results, setResults] = React.useState([]);
  const params = useParams();
  React.useEffect(() => {
    if (params.sessionId) {
      setSessionId(params.sessionId);
    }
  }, []);
  // console.log(getters, setters, sessionId);

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
      setters.setErrorMessage(data.error);
      setters.setErrorOpen(true);
    } else {
      setPlayerId(data.playerId);
    }
  }
  // Lobby where
  React.useEffect(() => {
    if (playerId && !started) {
      const pollStart = setInterval(async () => {
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
          }
        };
        const data = await apiRequest('/play/' + playerId + '/status', options);
        if (data.error) {
          if (data.error === 'Session ID is not an active session') {
            setStarted(true)
            setEnded(true);
          } else {
            setters.setErrorMessage(data.error)
            setters.setErrorOpen(true);
          }
        } else {
          if (data.started !== started) setStarted(data.started);
        }
      }, 500);
      return () => {
        clearInterval(pollStart);
      }
    }
  }, [started, playerId]);
  // Question where
  React.useEffect(() => {
    if (started && !ended) {
      const pollStart = setInterval(async () => {
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
          }
        };
        const data = await apiRequest('/play/' + playerId + '/question', options);
        if (data.error) {
          if (data.error === 'Session ID is not an active session') {
            setEnded(true);
          } else {
            setters.setErrorMessage(data.error)
            setters.setErrorOpen(true);
          }
          // console.log(data, setEnded)
        } else {
          // console.log(question)
          if (data.question !== question) {
            console.log(data.question !== question)
            setCorrect([]);
            setQuestion(data.question);
            setAllowed(true);
            setEnded(false);
          }
        }
      }, 200);
      return () => {
        clearInterval(pollStart);
      }
    }
  }, [question, started]);

  React.useEffect(async () => {
    if (!allowed) {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
        }
      };
      const data = await apiRequest('/play/' + playerId + '/answer', options);
      if (data.error) {
        setters.setErrorMessage(data.error)
        setters.setErrorOpen(true);
      } else {
        // console.log(data.answerIds);
        setCorrect(data.answerIds)
      }
    }
  }, [allowed]);

  React.useEffect(async () => {
    if (ended) {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
        }
      };
      const data = await apiRequest('/play/' + playerId + '/results', options);
      if (data.error) {
        setters.setErrorMessage(data.error)
        setters.setErrorOpen(true);
      } else {
        setResults(data);
        // console.log(data.answerIds);
        // setCorrect(data.answerIds)
      }
    }
  }, [ended]);

  const selectSingleAnswer = async (answer, disabled) => {
    console.log(answer);
    if (!disabled) {
      const options = {
        method: 'PUT',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          answerIds: [answer]
        })
      };
      const data = await apiRequest('/play/' + playerId + '/answer', options);
      if (data.error) {
        setters.setErrorMessage(data.error)
        setters.setErrorOpen(true);
      } else {
        console.log('success')
      }
    }
    // TODO ANSWER QN
    // setAllowed(false);
  }
  const selectMultiAnswer = async (answer, disabled) => {
    console.log(selected)
    console.log(answer, disabled);
    if (!disabled) {
      if (selected.includes(answer)) {
        setSelected(selected =>
          selected.filter((_, i) =>
            i !== selected.indexOf(answer)
          )
        )
        console.log('did1')
        console.log(selected)
      } else {
        setSelected([...selected, answer])
        console.log('did2')
        console.log(selected)
      }
      console.log(selected);
      // TODO ANSWER QN
    }
  }
  const sendMultiAnswer = async () => {
    const options = {
      method: 'PUT',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        answerIds: selected
      })
    };
    const data = await apiRequest('/play/' + playerId + '/answer', options);
    if (data.error) {
      setters.setErrorMessage(data.error)
      setters.setErrorOpen(true);
    } else {
      console.log('success mult')
    }
  }
  React.useEffect(sendMultiAnswer, [selected]);

  function TimeComponent ({ question }) {
    const now = new Date();
    const secs = (now - Date.parse(question.isoTimeLastQuestionStarted)) / 1000;
    // console.log(secs)
    let timeRemaining = question.timelimit - secs;
    let progress = 100 * (timeRemaining / question.timelimit);
    if (timeRemaining <= 0) {
      timeRemaining = 0;
      progress = 0;
      if (allowed) setAllowed(false);
    }

    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress variant='determinate' value={progress}/>
          <Box sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          >
            <Typography variant='caption' component="div" color="text.secondary">
              {Math.floor(timeRemaining)}
            </Typography>
          </Box>
        </Box>
    )
  }

  function CheckboxComponent ({ color, checked, onClick, label }) {
    return (
      <Box onClick={onClick} sx={{ backgroundColor: color + '.dark' }}>
        {/* Wrap the Checkbox in a FormControlLabel */}
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={onClick}
              // disabled={disabled}
              />
            }
          label={label}
        />
      </Box>
    );
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
        {playerId && !started &&
          <>
            <Typography variant="h4">Wating to start</Typography>
            <CircularProgress />
          </>
        }
        {started && !ended &&
          <>
            <Typography variant="h3">{question.question}</Typography>
            {(question.videourl !== '' || question.photosrc !== '') &&
              <Card>
                <CardContent>
                  {question.videourl !== '' &&
                    <ReactPlayer url={question.videourl}/>
                  }
                  {question.photosrc !== '' &&
                    <img src={question.photosrc}/>
                  }
                </CardContent>
              </Card>
            }

            <TimeComponent question={question}/>
            {question.answers.map((answer, index) => {
              console.log(correct, answer.answer, correct.includes(answer.answer))
              if (question.type === 'single') {
                return (
                  <Button variant='outlined' color={correct.includes(answer.answer) ? 'success' : 'primary'} key={'answer-' + index} onClick={() => selectSingleAnswer(answer.answer, !allowed)} >{answer.answer}</Button>
                )
              } else {
                return (
                  <CheckboxComponent color={correct.includes(answer.answer) ? 'success' : 'primary'} checked={selected.includes(answer.answer)} key={'answer-' + index} onClick={() => selectMultiAnswer(answer.answer, !allowed)} label={answer.answer} />
                )
              }
            })}
          </>
        }
        {ended &&
          <>
            <Typography variant="h3">Results</Typography>
            {results.map((result, index) => {
              const answerRes = result.correct ? 'correct!' : 'incorrect.'
              return (
                <>
                  <Typography variant='h4'>{'Question ' + (index + 1) }</Typography>
                  <Grid container justifyContent="center" spacing={2} columns={12}>
                    <Grid item justifyContent="center" xs={5}>
                      <Typography variant='h5' sx={{ textAlign: 'center' }} >You Answered:</Typography>
                      {result.answerIds.map((answer) => {
                        return (
                          <>
                            <Typography sx={{ textAlign: 'center', overflowWrap: 'break-word' }}>{answer}</Typography>
                          </>
                        )
                      })}
                      <Typography variant='h6' sx={{ textAlign: 'center' }} >This was {answerRes}</Typography>

                    </Grid>
                    {/* <Grid item justifyContent="center" xs={5}>
                      <Typography variant='h5'>Your Answers</Typography>
                      <Typography sx={{ textAlign: 'center', overflowWrap: 'break-word' }}>b</Typography>
                    </Grid> */}
                  </Grid>
                </>
              )
            })}
          </>
        }
      </Grid>
    </>
  )
}
