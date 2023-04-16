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
import { apiRequest } from '../utilities/helpers'
import { Link } from 'react-router-dom';
import { useContext, Context } from '../context';

// Creates all the quiz cards on the dashboard
export const QuizCard = ({ quiz, token, reRender }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [startGameDialogOpen, setStartGameDialogOpen] = React.useState(false);
  const [startGameTitle, setStartGameTitle] = React.useState('');
  const [sessionCode, setSessionCode] = React.useState('');
  const [endGameDialogOpen, setEndGameDialogOpen] = React.useState(false);
  const [endGameTitle, setEndGameTitle] = React.useState('');

  const { getters, setters } = useContext(Context);

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
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({})
    };
    const data = await apiRequest('/admin/quiz/' + quiz.id, options)
    closeDeleteGameDialog();
    if (data.error) {
      // setErrorMessage(data.error);
      // setErrorOpen(true);
    } else {
      reRender(true);
    }
  }

  const startGame = async (quizId, quizName) => {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${getters.token}`
      }
    };
    const data = await apiRequest('/admin/quiz/' + quizId + '/start', options);
    console.log(data)
    if (data.error) {
      setters.setErrorMessage(data.error)
    } else {
      // setSessionCode('TODO')
      // console.log('getting')
      const optionsGet = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${getters.token}`
        }
      };
      const dataGet = await apiRequest('/admin/quiz/' + quizId, optionsGet);
      if (dataGet.error) {
        setters.setErrorMessage(dataGet.error)
      } else {
        setStartGameDialogOpen(true);
        setStartGameTitle(quizName);
        setSessionCode(dataGet.active)
        reRender(true);
      }
    }
  }

  const endGame = async (quizId, quizName) => {
    const optionsGet = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${getters.token}`
      }
    };
    const dataGet = await apiRequest('/admin/quiz/' + quizId, optionsGet);
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
      if (data.error) {
        setters.setErrorMessage(data.error)
      } else {
        setStartGameDialogOpen(false);
        setEndGameDialogOpen(true);
        setEndGameTitle(quizName);
        setSessionCode(dataGet.active)
        reRender(true);
      }
      // TODO
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
            <Typography
            variant="body1"
            color="text.secondary"
            >
            {quiz.owner}
            </Typography>
            {quiz.questions
              ? <Typography
              variant="body1"
              color="text.secondary"
            >
            {Object.keys(quiz.questions).length} Questions
            Time to Complete: PLACEHOLDER TXT
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
            component={Link} to={'/viewgame/' + sessionCode}
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
          <Button onClick={() => navigator.clipboard.writeText('TODO/' + sessionCode)}>Copy Session URL</Button>
          <Button component={Link} to={'/viewgame/' + sessionCode}>View Game</Button>
          <Button onClick={() => endGame(quiz.id, quiz.name)}>End Game</Button>
          <Button onClick={() => setStartGameDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
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
          <Button component={Link} to={'/viewgame/' + sessionCode}>Yes</Button>
          <Button onClick={() => setEndGameDialogOpen(false)}>No</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
