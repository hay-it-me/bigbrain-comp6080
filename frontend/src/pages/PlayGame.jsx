import { Box, Button, Card, CardContent, Checkbox, CircularProgress, FormControlLabel, Grid, Typography } from '@mui/material';
import React from 'react';
import { useContext, Context } from '../context';
import { useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField/TextField';
import { apiRequest } from '../utilities/helpers';
import ReactPlayer from 'react-player';
// import TimeComponent from '../components/TimeComponent';

export const PlayGame = () => {
  // TODO CHECK FOR CANT JOIJN IN PROGRESS GAMES
  const { setters } = useContext(Context);
  const [playerId, setPlayerId] = React.useState('');
  const [sessionId, setSessionId] = React.useState('');
  const [name, setName] = React.useState('');
  const [started, setStarted] = React.useState(false);
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
          setters.setErrorMessage(data.error)
          setters.setErrorOpen(true);
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
    if (started) {
      const pollStart = setInterval(async () => {
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
          }
        };
        const data = await apiRequest('/play/' + playerId + '/question', options);
        if (data.error) {
          setters.setErrorMessage(data.error)
          setters.setErrorOpen(true);
        } else {
          // console.log(question)
          if (data.question !== question) {
            setQuestion(data.question);
            setAllowed(true);
          }
        }
      }, 200);
      return () => {
        clearInterval(pollStart);
      }
    }
  }, [question, started]);

  const selectSingleAnswer = (event) => {
    console.log(event);
    // TODO ANSWER QN
    setAllowed(false);
  }
  const selectMultiAnswer = (answer, disabled) => {
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
      console.log(selected);
      // TODO ANSWER QN
    }
  }
  const submitSelection = () => {
    console.log(selected)
  }
  function TimeComponent ({ question }) {
    const now = new Date();
    const secs = (now - Date.parse(question.isoTimeLastQuestionStarted)) / 1000;
    // console.log(secs)
    let timeRemaining = question.timelimit - secs;
    let progress = 100 * (timeRemaining / question.timelimit);
    if (timeRemaining <= 0) {
      timeRemaining = 0;
      progress = 0;
      setAllowed(false);
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

  function CheckboxComponent ({ checked, onClick, label, disabled }) {
    return (
      <Grid container alignItems="center" onClick={onClick} >
        {/* Wrap the Checkbox in a FormControlLabel */}
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={onClick}
              color="primary"
              disabled={disabled}
              />
            }
          label={label}
        />
      </Grid>
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
        {started &&
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
              if (question.type === 'single') {
                return (
                  <Button key={'answer-' + index} onClick={selectSingleAnswer} disabled={!allowed} >{answer.answer}</Button>
                )
              } else {
                return (
                  <CheckboxComponent disabled={!allowed} checked={selected.includes(answer.answer)} key={'answer-' + index} onClick={() => selectMultiAnswer(answer.answer, !allowed)} label={answer.answer} />
                )
              }
            })}
            {question.type === 'multiple' && <Button onClick={submitSelection}>Submit Selection</Button>}
          </>
        }
      </Grid>
    </>
  )
}
