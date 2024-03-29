import React from 'react';
import {
  CardMedia,
  CardHeader,
  Card,
  CardContent,
  Typography,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CardActions
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import { apiRequest, displayTime } from '../utilities/helpers'
import { Link } from 'react-router-dom';
import { useContext, Context } from '../context';

export const QuizCard = ({ quiz, rerender }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [startGameDialogOpen, setStartGameDialogOpen] = React.useState(false);
  const [startGameTitle, setStartGameTitle] = React.useState('');
  const [sessionCode, setSessionCode] = React.useState('');
  const [endGameDialogOpen, setEndGameDialogOpen] = React.useState(false);
  const [endGameTitle, setEndGameTitle] = React.useState('');
  const [questions, setQuestions] = React.useState(null);
  const { getters, setters } = useContext(Context);
  // Get quiz details
  React.useEffect(async () => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${getters.token}`
      }
    };
    const data = await apiRequest('/admin/quiz/' + quiz.id, options)
    if (data.error === 'Invalid token') localStorage.removeItem('token')
    if (data.error) {
      setters.setErrorMessage(data.error);
      setters.setErrorOpen(true);
    } else {
      setQuestions(data.questions)
    }
  }, [])

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const openDeleteGameDialog = () => {
    handleCloseMenu();
    setDeleteDialogOpen(true);
  }

  const closeDeleteGameDialog = () => {
    setDeleteDialogOpen(false);
  }

  async function deleteGame () {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${getters.token}`
      },
      body: JSON.stringify({})
    };
    const data = await apiRequest('/admin/quiz/' + quiz.id, options)
    if (data.error === 'Invalid token') localStorage.removeItem('token')
    closeDeleteGameDialog();
    if (data.error) {
      setters.setErrorMessage(data.error)
      setters.setErrorOpen(true);
    } else {
      rerender(true);
    }
  }

  // Start Game handler
  const startGame = async (quizId, quizName) => {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${getters.token}`
      }
    };
    const data = await apiRequest('/admin/quiz/' + quizId + '/start', options);
    if (data.error === 'Invalid token') localStorage.removeItem('token')
    console.log(data)
    if (data.error) {
      setters.setErrorMessage(data.error)
      setters.setErrorOpen(true);
    } else {
      const optionsGet = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${getters.token}`
        }
      };
      // We need to make a request to quiz/quizId to get the session code because the backed doenst return the session code when we start
      const dataGet = await apiRequest('/admin/quiz/' + quizId, optionsGet);
      if (dataGet.error === 'Invalid token') localStorage.removeItem('token')
      if (dataGet.error) {
        setters.setErrorMessage(dataGet.error)
      } else {
        setStartGameDialogOpen(true);
        setStartGameTitle(quizName);
        setSessionCode(dataGet.active)
        rerender(true);
      }
    }
  }
  //  In order to end game we need to first get the session id so we can later ask if they want to be redirected to the results screen.
  const endGame = async (quizId, quizName) => {
    const optionsGet = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${getters.token}`
      }
    };
    const dataGet = await apiRequest('/admin/quiz/' + quizId, optionsGet);
    if (dataGet.error === 'Invalid token') localStorage.removeItem('token')
    if (dataGet.error) {
      setters.setErrorMessage(dataGet.error)
    } else {
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${getters.token}`
        }
      };
      const data = await apiRequest('/admin/quiz/' + quizId + '/end', options);
      if (data.error === 'Invalid token') localStorage.removeItem('token')
      if (data.error) {
        setters.setErrorMessage(data.error)
        setters.setErrorOpen(true);
      } else {
        setStartGameDialogOpen(false);
        setEndGameDialogOpen(true);
        setEndGameTitle(quizName);
        setSessionCode(dataGet.active)
        rerender(true);
      }
    }
  }

  return (
    <>
      <Card key={quiz.id} sx={{ minWidth: 300, maxWidth: 350, margin: 2 }}>
        <CardHeader
          action={
            <>
              <IconButton
                aria-label={quiz.name + '-settings'}
                aria-controls={quiz.id + '-menu-button'}
                aria-haspopup="true"
                onClick={handleOpenMenu}
                color="inherit"
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id={quiz.id + '-menu-button'}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                sx={{
                  display: { xs: 'block' },
                }}
              >
                <MenuItem key='Edit Game' onClick={handleCloseMenu} component={Link} to={'/editgame/' + quiz.id}>
                    <Typography textAlign="center">Edit Game</Typography>
                  </MenuItem>
                <MenuItem key='Delete Game' onClick={openDeleteGameDialog} >
                  <Typography textAlign="center" color="red">Delete Game</Typography>
                </MenuItem>
                {/* Past Games menu here */}
                <MenuItem key='View Past Games' onClick={handleCloseMenu} component={Link} to={'/viewpastsessions/' + quiz.id}>
                  <Typography textAlign="center">View Past Games</Typography>
                </MenuItem>
              </Menu>
            </>
          }
          title={quiz.name}
          subheader={new Date(quiz.createdAt).toLocaleDateString('en-US')}
        />
        <CardMedia
            component="img"
            height="200"
            image={quiz.thumbnail}
            alt={quiz.name + ' thumbnail'}
        />
        <CardContent>
            {questions
              ? <Typography
              variant="body1"
              color="text.secondary"
            >
            {questions.length} Questions,
            Time to Complete: {displayTime(questions.reduce((sum, a) => sum + a.timelimit, 0))}
            </Typography>
              : <Typography
              variant="body1"
              color="text.secondary"
            >
              No Questions
            </Typography>
            }
        </CardContent>
        <CardActions>
          {!quiz.active && <Button
            onClick={() => startGame(quiz.id, quiz.name)}
            size="small"
          >
            Start Game
          </Button>}
          {quiz.active && <Button
            component={Link} to={'/viewgame/' + quiz.id + '/' + quiz.active}
            size='small'
          >
            View Game in Progress
          </Button>}
          {quiz.active && <Button
            onClick={() => endGame(quiz.id, quiz.name)}
            size="small"
          >
            End Game
          </Button>}

        </CardActions>
      </Card>
      {/* Confirm Delete dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteGameDialog}
      >
        <DialogTitle>
          Delete {quiz.name}
        </DialogTitle>
        <DialogContent>
          <Typography
            variant='body2'>
              Are you sure you want to delete this game?
              This cannot be undone.
            </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteGameDialog}>Cancel</Button>
          <Button onClick={deleteGame}>Submit</Button>
        </DialogActions>
      </Dialog>
      {/* Start Game dialog */}
      <Dialog
        open={startGameDialogOpen}
      >
        <DialogTitle>
          {'Game started for quiz: ' + startGameTitle}
        </DialogTitle>
        <DialogContent>
          Session Code: {sessionCode}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigator.clipboard.writeText('http://localhost:3000/play/' + sessionCode)}>Copy Session URL</Button>
          <Button component={Link} to={'/viewgame/' + quiz.id + '/' + sessionCode}>View Game</Button>
          <Button onClick={() => endGame(quiz.id, quiz.name)}>End Game</Button>
          <Button onClick={() => setStartGameDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* Game ended dialog */}
      <Dialog
        open={endGameDialogOpen}
      >
        <DialogTitle>
          {'Game ended for quiz: ' + endGameTitle}
        </DialogTitle>
        <DialogContent>
          Would you like to view the results?
        </DialogContent>
        <DialogActions>
          <Button component={Link} to={'/viewgame/' + quiz.id + '/' + sessionCode}>Yes</Button>
          <Button onClick={() => setEndGameDialogOpen(false)}>No</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
