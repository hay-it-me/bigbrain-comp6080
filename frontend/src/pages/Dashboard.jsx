import {
  Snackbar,
  Alert,
  CardMedia,
  CardHeader,
  Card,
  CardContent,
  Typography,
  Button,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Input,
  Dialog,
  DialogActions,
  Box
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import React from 'react';
import ResponsiveAppBar from '../components/Navbar';
import { apiRequest } from '../utilities/helpers'

export const Dashboard = ({ onLogout, token }) => {
  const [quizzes, setQuizzes] = React.useState([]);
  const [errorOpen, setErrorOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [newGameDialogOpen, setNewGameDialogOpen] = React.useState(false);
  const [newGameTitle, setNewGameTitle] = React.useState('');
  const [rerenderQuizzes, setRerenderQuizzes] = React.useState(false);

  function logoutUser () {
    onLogout(true);
  }

  const handleErrorClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorOpen(false);
  };

  React.useEffect(async () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    };
    const data = await apiRequest('/admin/quiz', options)
    console.log(data);
    if (data.error) {
      setErrorMessage(data.error);
      setErrorOpen(true);
    } else {
      setQuizzes(data.quizzes);
    }
  }, [rerenderQuizzes]);

  const createNewGame = async () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: newGameTitle
      })
    };
    const data = await apiRequest('/admin/quiz/new', options);
    if (data.error) {
      setErrorMessage(data.error)
    } else {
      setRerenderQuizzes(true);
    }
    closeNewGameDialog();
  };

  const closeNewGameDialog = () => {
    setNewGameDialogOpen(false)
    setNewGameTitle('');
  }

  // Creates all the quiz cards on the dashboard
  const QuizCards = ({ quizzes }) => {
    return quizzes.map((quiz) => (
      <Card key={quiz.id} sx={{ minWidth: 300, maxWidth: 350, margin: 2 }}>
        <CardHeader
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
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
        </CardContent>
      </Card>
    ))
  };

  return (
    <>
      <Snackbar open={errorOpen} autoHideDuration={6000} onClose={handleErrorClose}>
        <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
      <ResponsiveAppBar setLogout={() => logoutUser()} />
      <Button
        sx={{ marginTop: '30px' }}
        variant="outlined"
        onClick={() => setNewGameDialogOpen(true)}
      >
        Create a New Game
      </Button>
      <Dialog
        open={newGameDialogOpen}
        onClose={closeNewGameDialog}
      >
        <DialogTitle>
          Create a New Game
        </DialogTitle>
        <DialogContent>
          <FormControl variant="standard" fullWidth >
            <InputLabel htmlFor="new-game-name">Name</InputLabel>
            <Input
              id="new-game-name"
              type="text"
              value={newGameTitle}
              onChange={(event) => {
                setNewGameTitle(event.target.value);
              }}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeNewGameDialog}>Cancel</Button>
          <Button onClick={createNewGame}>Submit</Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ display: 'flex' }}>
        <QuizCards
          quizzes={quizzes}
        />
      </Box>
    </>
  )
}
