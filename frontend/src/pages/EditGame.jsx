import {
  Grid,
  // Snackbar,
  // Alert,
  FormControl,
  Input,
  Box,
  Button,
  styled,
  Typography,
  Divider,
  Skeleton,
  List
} from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import React from 'react';
import { apiRequest, fileToDataUrl } from '../utilities/helpers';
import { QuestionListItem } from '../components/QuestionListItem';
// import ResponsiveAppBar from '../components/Navbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useContext, Context } from '../context';

export const EditGame = () => {
  // const [getters.errorOpen, setters.setErrorOpen] = React.useState(false);
  // const [getters.errorMessage, setters.setErrorMessage] = React.useState('');
  const [quizQuestions, setQuizQuestions] = React.useState([]);
  const [quizName, setQuizName] = React.useState('');
  const [quizThumbnail, setQuizThumbnail] = React.useState('');
  const { getters, setters } = useContext(Context);

  const { gameId } = useParams();

  // function logoutUser () {
  //   onLogout(true);
  // }

  // const handleErrorClose = (event, reason) => {
  //   if (reason === 'clickaway') {
  //     return;
  //   }
  //   setters.setErrorOpen(false);
  // };

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

  const addNewQuestion = () => {
    setQuizQuestions(quizQuestions =>
      [...quizQuestions, {
        question: 'Sample Question',
        type: 'single',
        answers: [
          {
            answer: 'Sample Answer 1',
            correct: true
          }
        ],
        timelimit: 0,
        points: 0,
        videourl: '',
        photosrc: ''
      }]
    );
  }

  const deleteQuestion = (index) => {
    setQuizQuestions(quizQuestions =>
      quizQuestions.filter((_, i) =>
        i !== index
      )
    )
  }

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

  React.useEffect(async () => {
    const options = {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${getters.token}`
      },
      body: JSON.stringify({
        questions: quizQuestions,
        name: quizName,
        thumbnail: quizThumbnail
      })
    };
    const data = await apiRequest('/admin/quiz/' + gameId, options)
    console.log('/admin/quiz/' + gameId);
    if (data.error) {
      setters.setErrorMessage(data.error);
      setters.setErrorOpen(true);
    }
  }, [quizQuestions, quizName, quizThumbnail])

  const FlexDiv = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  })

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
        <FlexDiv>
          {quizThumbnail && (
            <>
              <Box>
                <BorderedImage src={quizThumbnail} alt={quizName + ' Quiz Thumbnail'} />
              </Box>
            </>
          )}
          {!quizThumbnail && (
            <>
              <Box>
                <Skeleton variant="rectangular" height={100} width={100}/>
              </Box>
            </>
          )}
        </FlexDiv>
        <FlexDiv>
          <HiddenFileInput
            accept="image/*"
            id="hidden-button-file"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="hidden-button-file">
            <Button variant="contained" component="span" sx={{ marginTop: '30px' }}>
              Upload Thumbnail
            </Button>
          </label>
        </FlexDiv>
      </>
    )
  };

  const QuizQuestions = () => {
    console.log(quizQuestions);
    return (
      <>
      <Box>
        <Typography variant="h6" sx={{ marginTop: '20px' }}>
          Questions
        </Typography>
        <Divider />
        <List>
          {quizQuestions && quizQuestions.map((question, index) => {
            return (
              <QuestionListItem
              key={index}
              question={question}
              questionId={index}
              gameId={gameId}
              onDelete={() => deleteQuestion(index)}
            />
            )
          })}
        </List>
        <Button variant="contained" onClick={addNewQuestion}>
          Add New Question
        </Button>
      </Box>
      </>
    )
  };

  return (
    <>
      {/* <Snackbar open={getters.errorOpen} autoHideDuration={6000} onClose={handleErrorClose}>
        <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
          {getters.errorMessage}
        </Alert>
      </Snackbar> */}
      {/* <ResponsiveAppBar setLogout={() => logoutUser()} /> */}
      <FlexDiv>
        <Button
          component={Link}
          to="/dashboard"
        >
          <ArrowBackIcon />
        </Button>
        <FormControl variant="standard" >
          <Input
            id="game-name"
            type="text"
            value={quizName}
            autoFocus
            onChange={(event) => {
              setQuizName(event.target.value);
            }}
            sx={{
              fontSize: '2rem',
              marginBottom: '10px'
            }}
          />
        </FormControl>
      </FlexDiv>
      <Divider sx={{ mb: 2 }}/>
      <Grid container>
        <Grid
          item
          xs={12}
          justifyContent="center"
        >
          <QuizForm />
          <QuizQuestions />
        </Grid>
      </Grid>
    </>
  )
}
