import {
  Grid,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Input,
  Box,
  Button,
  styled,
  Typography
} from '@mui/material';
import { useParams } from 'react-router-dom';
import React from 'react';
import { apiRequest, fileToDataUrl } from '../utilities/helpers'
import ResponsiveAppBar from '../components/Navbar';
import { useContext, Context } from '../context';

export const EditGame = ({ onLogout }) => {
  // const [getters.errorOpen, setters.setErrorOpen] = React.useState(false);
  // const [getters.errorMessage, setters.setErrorMessage] = React.useState('');
  const [quizQuestions, setQuizQuestions] = React.useState(null);
  const [quizName, setQuizName] = React.useState('');
  const [quizThumbnail, setQuizThumbnail] = React.useState('');
  const { getters, setters } = useContext(Context);

  const { gameId } = useParams();

  function logoutUser () {
    onLogout(true);
  }

  const handleErrorClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setters.setErrorOpen(false);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const dataUrl = await fileToDataUrl(file);
        setQuizThumbnail(dataUrl);
      } catch (error) {
        setters.setErrorMessage('Error occured whilst reading file');
        setters.setErrorOpen(true);
      }
    }
  };

  React.useEffect(async () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${getters.token}`
      }
    };
    const data = await apiRequest('/admin/quiz/' + gameId, options)
    console.log('/admin/quiz/' + gameId);
    if (data.error) {
      setters.setErrorMessage(data.error);
      setters.setErrorOpen(true);
    } else {
      setQuizQuestions(data.questions);
      setQuizName(data.name);
      setQuizThumbnail(data.thumbnail);
    }
  }, []);

  const HiddenFileInput = styled('input')({
    display: 'none',
  });

  const BorderedImage = styled('img')({
    border: '1px solid black',
    maxWidth: '100%',
    maxHeight: '100px'
  });

  const QuizForm = () => {
    return (
      <>
        <Typography variant="h6">
          Quiz Details
        </Typography>
        <FormControl variant="standard" >
          <InputLabel htmlFor="game-name">Name</InputLabel>
          <Input
            id="game-name"
            type="text"
            value={quizName}
            onChange={(event) => {
              setQuizName(event.target.value);
            }}
          />
        </FormControl>
        <Box>
          <Box>
            <HiddenFileInput
              accept="image/*"
              id="contained-button-file"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="contained-button-file">
              <Button variant="contained" component="span" sx={{ marginTop: '30px' }}>
                Upload Thumbnail
              </Button>
            </label>
          </Box>
          {quizThumbnail && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <BorderedImage src={quizThumbnail} alt={quizName + ' Quiz Thumbnail'} />
            </Box>
          </>
          )}
        </Box>
      </>
    )
  };

  const QuizQuestions = () => {
    console.log(quizQuestions);
    return (
      <>
        <Typography variant="h6">
          Questions
        </Typography>
      </>
    )
  };

  return (
    <>
      <Snackbar open={getters.errorOpen} autoHideDuration={6000} onClose={handleErrorClose}>
        <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
          {getters.errorMessage}
        </Alert>
      </Snackbar>
      <ResponsiveAppBar setLogout={() => logoutUser()} />
      <Grid container>
        <Grid item xs={12} sm={6}>
          <QuizForm />
        </Grid>
        <Grid item xs={12} sm={6}>
          <QuizQuestions />
        </Grid>
      </Grid>
    </>
  )
}
