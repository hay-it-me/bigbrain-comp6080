import {
  // Snackbar,
  // Alert,
  Button,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Input,
  Dialog,
  DialogActions,
  Grid,
} from '@mui/material';
import React from 'react';
// import ResponsiveAppBar from '../components/Navbar';
import { QuizCard } from '../components/QuizCard';
import { apiRequest } from '../utilities/helpers'
import { useContext, Context } from '../context';

export const Dashboard = () => {
  const [quizzes, setQuizzes] = React.useState([]);
  const [newGameDialogOpen, setNewGameDialogOpen] = React.useState(false);
  const [newGameTitle, setNewGameTitle] = React.useState('');
  const [rerenderQuizzes, setRerenderQuizzes] = React.useState(false);

  const { getters, setters } = useContext(Context);

  // function logoutUser () {
  //   onLogout(true);
  // }

  const rerenderQuizList = () => {
    setRerenderQuizzes(!rerenderQuizzes);
  }

  // const handleErrorClose = (event, reason) => {
  //   if (reason === 'clickaway') {
  //     return;
  //   }
  //   setters.setErrorOpen(false);
  // };

  React.useEffect(async () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${getters.token}`
      }
    };
    const data = await apiRequest('/admin/quiz', options)
    console.log(data);
    if (data.error) {
      setters.setErrorMessage(data.error);
      setters.setErrorOpen(true);
    } else {
      setQuizzes(data.quizzes);
    }
  }, [rerenderQuizzes]);

  const createNewGame = async () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${getters.token}`
      },
      body: JSON.stringify({
        name: newGameTitle
      })
    };
    const data = await apiRequest('/admin/quiz/new', options);
    if (data.error) {
      setters.setErrorMessage(data.error);
      setters.setErrorOpen(true);
    } else {
      rerenderQuizList();
    }
    closeNewGameDialog();
  };

  const closeNewGameDialog = () => {
    setNewGameDialogOpen(false)
    setNewGameTitle('');
  }
  return (
    <>
      {/* <Snackbar open={getters.errorOpen} autoHideDuration={6000} onClose={handleErrorClose}>
        <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
          {getters.errorMessage}
        </Alert>
      </Snackbar> */}
      {/* <ResponsiveAppBar setLogout={() => logoutUser()} /> */}
      <Button
        // sx={{ marginTop: '30px' }}
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
      <Grid
        container
        justifyContent="center"
        spacing={2}
        sx={{ display: 'flex' }}
      >
        {quizzes.map((quiz) => {
          return <Grid item xs={12} sm={6} md={4} key={'quiz-' + quiz.id} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
            <QuizCard
              quiz={quiz}
              rerender={() => rerenderQuizList()}
              margin='1'
            />
          </Grid>
        })}
      </Grid>
    </>
  )
}
