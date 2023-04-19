import { Box, Button, Card, CardContent, CardMedia, Checkbox, CircularProgress, FormControlLabel, Grid, Typography } from '@mui/material';
import React from 'react';
import { useContext, Context } from '../context';
import { Link, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { apiRequest } from '../utilities/helpers';
import ReactPlayer from 'react-player';

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
  const [allowed, setAllowed] = React.useState(true);
  const [selected, setSelected] = React.useState([]);
  const [correct, setCorrect] = React.useState([]);
  const [results, setResults] = React.useState([]);
  const _ = require('lodash');
  // Get params
  const params = useParams();
  React.useEffect(() => {
    if (params.sessionId) {
      // Set session id from params if it exists
      setSessionId(params.sessionId);
    }
  }, []);

  // Reset (Play again) handler
  const reset = () => {
    setPlayerId('');
    setSessionId('');
    setStarted(false);
    setEnded(false);
    setQuestion({
      question: '',
      type: '',
      answers: [],
      timelimit: 0,
      points: 0,
      videourl: 'url',
      photosrc: 'src',
      isoTimeLastQuestionStarted: '',
    });
    setAllowed(true);
    setSelected([]);
    setCorrect([]);
    setResults([]);
  }
  // Join Game handler
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
    if (data.error === 'Invalid token') localStorage.removeItem('token')
    if (data.error) {
      setters.setErrorMessage(data.error);
      setters.setErrorOpen(true);
    } else {
      // Set player id from response
      setPlayerId(data.playerId);
    }
  }
  // Lobby time, poll for start
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
        if (data.error === 'Invalid token') localStorage.removeItem('token')
        if (data.error) {
          if (data.error === 'Session ID is not an active session') {
            console.log('ended')
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

  // Question time, poll for next question
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
        if (data.error === 'Invalid token') localStorage.removeItem('token')
        if (data.error) {
          if (data.error === 'Session ID is not an active session') {
            console.log('ended')
            setEnded(true);
          } else {
            setters.setErrorMessage(data.error)
            setters.setErrorOpen(true);
          }
        } else {
          // Deep equals to check if the objects are the same. If not we reset state and display new data
          if (!_.isEqual(data.question, question)) {
            setCorrect([])
            setQuestion(data.question);
            setAllowed(true);
            setEnded(false);
            setSelected([]);
          }
        }
        // 150ms poll
      }, 150);
      return () => {
        clearInterval(pollStart);
      }
    }
  }, [started, question, ended]);
  // Getting correct answer as time has run out
  React.useEffect(async () => {
    if (!allowed) {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
        }
      };
      const data = await apiRequest('/play/' + playerId + '/answer', options);
      if (data.error === 'Invalid token') localStorage.removeItem('token')
      if (data.error) {
        if (data.error === 'Session ID is not an active session') {
          setEnded(true);
          // Sometimes client and server dont sync very well so we will allow some leeway for another answer request. This wouldnt be a problem if the server also sent the current time (or even did the remaining time calc itself)
        } else if (data.error === 'Question time has not been completed') {
          setAllowed(true);
          setTimeout(() => { setAllowed(false) }, 100)
        } else {
          setters.setErrorMessage(data.error);
          setters.setErrorOpen(true);
        }
      } else {
        setCorrect(data.answerIds)
      }
    }
  }, [allowed]);

  // Game has ended so request results
  React.useEffect(async () => {
    if (ended) {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
        }
      };
      const data = await apiRequest('/play/' + playerId + '/results', options);
      if (data.error === 'Invalid token') localStorage.removeItem('token')
      if (data.error) {
        setters.setErrorMessage(data.error)
        setters.setErrorOpen(true);
      } else {
        setResults(data);
      }
    }
  }, [ended]);

  // Handler for selecting any single answer button
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
      if (data.error === 'Invalid token') localStorage.removeItem('token')
      if (data.error) {
        setters.setErrorMessage(data.error)
        setters.setErrorOpen(true);
      } else {
        console.log('success')
      }
    }
  }
  // Handler for selecting any multi answer button / checkbox
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
      } else {
        setSelected([...selected, answer])
      }
    }
  }
  const sendMultiAnswer = async () => {
    if (selected.length > 0) {
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
      if (data.error === 'Invalid token') localStorage.removeItem('token')
      if (data.error) {
        setters.setErrorMessage(data.error)
        setters.setErrorOpen(true);
      }
    }
  }
  React.useEffect(sendMultiAnswer, [selected]);

  // Time Displaying component
  function TimeComponent ({ question }) {
    // Progress is for the circular progress spinner
    const [progress, setProgress] = React.useState(0);
    // Time remaining is seconds displayed in the spinner as text
    const [timeRemaining, setTimeRemaining] = React.useState(0);

    React.useEffect(() => {
      const timer = setInterval(() => {
        const now = new Date();
        const secs = (now - Date.parse(question.isoTimeLastQuestionStarted)) / 1000;
        setTimeRemaining(question.timelimit - secs);
        setProgress(100 * ((question.timelimit - secs) / question.timelimit));
        // If we ran out of time keep time and progress at 0 and disallow answering the question anymore
        if (question.timelimit - secs <= 0) {
          setTimeRemaining(0);
          setProgress(0);
          if (allowed) setAllowed(false);
        }
      }, 100);
      return () => {
        clearInterval(timer);
      }
    }, [question, timeRemaining, progress])

    return (
      <section aria-label="Time Component" role="timer">
        <div aria-valuemax={question.timelimit} aria-valuemin="0" aria-valuenow={timeRemaining} aria-valuetext={`${timeRemaining} seconds left`}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant='determinate' value={progress} />
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
                {Math.ceil(timeRemaining)}
              </Typography>
            </Box>
          </Box>
        </div>
      </section>
    );
  }

  function CheckboxComponent ({ color, checked, onClick, label }) {
    return (
        <Box borderRadius={3} onClick={onClick} sx={{ backgroundColor: color + '.dark' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={onClick}
                />
              }
            label={label}
          />
        </Box>
    );
  }

  return (
    <main>
      <header>
      <Typography variant='h3'>Play a Game</Typography>
      </header>
      <section aria-label="Game">
        <Grid container alignItems="center" direction="column" justifyContent="center" sx={{ width: '90%' }}>
          {/* Join Game phase */}
          {!playerId && (
            <>
              <TextField
                sx={{ margin: '10px' }}
                id="session-code"
                name="session-code"
                aria-required="true"
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
                name="player-name"
                aria-required="true"
                label="Enter Your Name"
                variant='outlined'
                value={name}
                onChange={(event) => {
                  setName(event.target.value)
                }}
              />
              <Button
                variant="outlined"
                role="button"
                aria-label="Join Game"
                onClick={joinGame}
              >
                Join Game
              </Button>
            </>
          )}
          {/* Lobby phase */}
          {playerId && !started && (
            <>
              <Typography variant="h4">Game has not begun. Please Wait.</Typography>
              <CircularProgress />
            </>
          )}
          {/* Question phase */}
          {started && !ended && (
            <>
              <Typography variant="h3">{question.question}</Typography>
              {(question.videourl !== '' || question.photosrc !== '') && (
                <Card sx={{ width: '90%' }}>
                  <CardContent sx={{ width: '100%', height: '100%' }}>
                    {question.videourl !== '' && (
                      <ReactPlayer url={question.videourl} alt="Video Question" />
                    )}
                    {question.photosrc !== '' && (
                      <CardMedia component="img" image={question.photosrc} alt="Image Question" />
                    )}
                  </CardContent>
                </Card>
              )}

              <TimeComponent question={question}/> <br/>
              {question.answers.map((answer, index) => {
                console.log(correct, answer.answer, correct.includes(answer.answer))
                if (question.type === 'single') {
                  return (
                    <>
                      <section key={'option-' + index} aria-label="Single Answer Option">
                        <Button variant='contained' color={correct.includes(answer.answer) ? 'success' : 'primary'} key={question + index} onClick={() => selectSingleAnswer(answer.answer, !allowed)} >{answer.answer}</Button>
                      </section><br/>
                    </>
                  )
                } else {
                  return (
                    <>
                      <section key={'option-' + index} aria-label="Multiple Answer Option">
                        <CheckboxComponent color={correct.includes(answer.answer) ? 'success' : 'primary'} checked={selected.includes(answer.answer)} key={question + index} onClick={() => selectMultiAnswer(answer.answer, !allowed)} label={answer.answer} />
                      </section><br/>
                    </>
                  )
                }
              })}
            </>
          )}
          {/* Results phase */}
          {ended && (
            <>
              <Typography variant="h3">Results</Typography><br/>
              <Typography variant="h5">Check your hosts screen to see if you got into the top 5!</Typography><br/>
              {results.map((result, index) => {
                const answerRes = result.correct ? 'correct!' : 'incorrect.'
                return (
                  <>
                    <Typography variant='h5'>{'Question ' + (index + 1) }</Typography>
                    <Grid container justifyContent="center" spacing={2} columns={12}>
                      <Grid item justifyContent="center" xs={5}>
                        <Typography variant='h6' sx={{ textAlign: 'center' }} >You Answered:</Typography>
                        {result.answerIds.map((answer) => {
                          return (
                            <>
                              <Typography sx={{ textAlign: 'center', overflowWrap: 'break-word' }}>{answer}</Typography>
                            </>
                          )
                        })}
                        <Typography variant='h6' sx={{ textAlign: 'center' }} >This was {answerRes}</Typography><br/>

                      </Grid>
                    </Grid>
                  </>
                )
              })}
              {/* Points calculation explanation */}
              <Typography variant='h6' sx={{ ml: 5, mr: 5 }} >Points calculation: Each quiz question has a maximum number of points assigned. Getting the answer right automatically gives you half of those points. The other half is based on the % time remaining when you answered the question correctly. The faster you answer correctly the more points you get!</Typography>
              <Button variant='contained' onClick={reset}><Link to='/play'>Play Again</Link></Button>
            </>
          )}
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
