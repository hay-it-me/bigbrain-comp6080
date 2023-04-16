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
export const QuizCard = ({ quiz, token, onDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [startGameDialogOpen, setStartGameDialogOpen] = React.useState(false);
  const [startGameTitle, setStartGameTitle] = React.useState('');
  const [startGameDialogCode, setStartGameDialogCode] = React.useState('');
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
      onDelete(true);
    }
  }

  const startGame = async (quizId, quizName) => {
    setStartGameDialogOpen(true);
    setStartGameTitle(quizName);
    setStartGameDialogCode('TODO')
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${getters.token}`
      }
    };
    const data = await apiRequest('/admin/quiz/' + quizId + '/start', options);
    if (data.error) {
      setters.setErrorMessage(data.error)
    } else {
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
        setStartGameDialogCode(dataGet.active)
      }
    }
  }

  const endGame = async (quizId, quizName) => {
    setEndGameDialogOpen(true);
    setEndGameTitle(quizName);
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
          <Button
            onClick={() => startGame(quiz.id, quiz.name)}
            size="small">
            Start Game
          </Button>
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
          {'Starting Game for quiz: ' + startGameTitle}
        </DialogTitle>
        <DialogContent>
          Session Code: {startGameDialogCode}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigator.clipboard.writeText('TODO/' + startGameDialogCode)}>Copy Session URL</Button>
          <Button onClick={() => endGame()}>End Game</Button>
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
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={() => navigator.clipboard.writeText('TODO/' + startGameDialogCode)}>Copy Session URL</Button>
          <Button onClick={() => console.log('end')}>End Game</Button>
          <Button onClick={() => setStartGameDialogOpen(false)}>Close</Button> */}
        </DialogActions>
      </Dialog>
    </>
  )
}
