import {
  Button,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Input,
  Dialog,
  DialogActions,
  Grid,
  Typography,
} from '@mui/material';
import React from 'react';
import { QuizCard } from '../components/QuizCard';
import { FlexDiv, apiRequest } from '../utilities/helpers'
import { useContext, Context } from '../context';

export const Dashboard = () => {
  const [quizzes, setQuizzes] = React.useState([]);
  const [newGameDialogOpen, setNewGameDialogOpen] = React.useState(false);
  const [newGameTitle, setNewGameTitle] = React.useState('');
  const [rerenderQuizzes, setRerenderQuizzes] = React.useState(false);

  const { getters, setters } = useContext(Context);

  const rerenderQuizList = () => {
    setRerenderQuizzes(!rerenderQuizzes);
  }

  // Get quizzes
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
    if (data.error === 'Invalid token') localStorage.removeItem('token')
    if (data.error) {
      setters.setErrorMessage(data.error);
      setters.setErrorOpen(true);
    } else {
      setQuizzes(data.quizzes);
    }
  }, [rerenderQuizzes]);

  // Create new game handler
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
    if (data.error === 'Invalid token') localStorage.removeItem('token')
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
    <main>
      <header>
        <FlexDiv>
          <Button
            variant="outlined"
            name="new-game-button"
            onClick={() => setNewGameDialogOpen(true)}
            aria-label="Create a New Game"
          >
            Create a New Game
          </Button>
        </FlexDiv>
      </header>
      <section>
        <Dialog
          open={newGameDialogOpen}
          onClose={closeNewGameDialog}
          aria-labelledby="create-new-game"
        >
          <DialogTitle id="create-new-game">
            Create a New Game
          </DialogTitle>
          <DialogContent>
            <FormControl variant="standard" fullWidth >
              <InputLabel htmlFor="new-game-name">Name</InputLabel>
              <Input
                id="new-game-name"
                name="new-game-name"
                type="text"
                value={newGameTitle}
                onChange={(event) => {
                  setNewGameTitle(event.target.value);
                }}
                aria-labelledby="new-game-name"
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
          role="list"
        >
          {quizzes.map((quiz) => {
            return <Grid item xs={12} sm={6} md={4} key={'quiz-' + quiz.id} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} role="listitem">
              <QuizCard
                quiz={quiz}
                rerender={() => rerenderQuizList()}
                margin='1'
              />
            </Grid>
          })}
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
