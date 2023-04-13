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
  DialogActions
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import React from 'react';
import ResponsiveAppBar from '../components/Navbar';

export const Dashboard = ({ token }) => {
  const [quizzes, setQuizzes] = React.useState([]);
  const [errorOpen, setErrorOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [newGameDialogOpen, setNewGameDialogOpen] = React.useState(false);
  const [newGameTitle, setNewGameTitle] = React.useState('');
  const [rerenderQuizzes, setRerenderQuizzes] = React.useState(false)

  // function logoutUser (logoutStatus) {
  //   console.log('penis');
  // }

  const handleErrorClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorOpen(false);
  };

  React.useEffect(async () => {
    console.log(token);
    const response = await fetch('http://localhost:5005/admin/quiz', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    const data = await response.json();
    console.log(data);
    if (data.error) {
      setErrorMessage(data.error);
      setErrorOpen(true);
    } else {
      setQuizzes(data.quizzes);
    }
  }, [rerenderQuizzes]);

  const createNewGame = async () => {
    const response = await fetch('http://localhost:5005/admin/quiz/new', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: newGameTitle
      })
    });
    const data = await response.json();
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

  // Can you fkin exist or something
  const quizCard = (quiz) => {
    <React.Fragment>
      <Card sx={{ maxWidth: 350 }}>
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
          alt={quiz.name}
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
    </React.Fragment>
  };

  return (
    <>
      <Snackbar open={errorOpen} autoHideDuration={6000} onClose={handleErrorClose}>
        <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
      <ResponsiveAppBar />
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
          <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
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
      {quizzes.map((quiz) => {
        return quizCard(quiz);
      })}
    </>
  )
}
