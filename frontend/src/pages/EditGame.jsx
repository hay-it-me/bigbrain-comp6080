import {
  Grid,
  FormControl,
  Input,
  Box,
  Button,
  styled,
  Typography,
  Divider,
  Skeleton,
  List,
  InputLabel
} from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import React from 'react';
import { apiRequest, fileToDataUrl, FlexDiv } from '../utilities/helpers';
import { QuestionListItem } from '../components/QuestionListItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useContext, Context } from '../context';

export const EditGame = () => {
  const [quizQuestions, setQuizQuestions] = React.useState([]);
  const [quizName, setQuizName] = React.useState('');
  const [quizThumbnail, setQuizThumbnail] = React.useState('');
  const [updateName, setUpdateName] = React.useState(false)
  const { getters, setters } = useContext(Context);

  const { gameId } = useParams();
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
  }, [quizQuestions, updateName, quizThumbnail])

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
      <section aria-label="Quiz Form">
        <FlexDiv>
          {quizThumbnail && (
            <>
              <Box>
                <BorderedImage id="quiz-image" src={quizThumbnail} alt={quizName + ' Quiz Thumbnail'} />
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
          <label htmlFor="hidden-button-file">
            <Button
              variant="contained"
              component="span"
              sx={{ marginTop: '30px' }}
              aria-label="Upload Thumbnail Button"
            >
              Upload Thumbnail
            </Button>
          </label>
          <HiddenFileInput
            accept="image/*"
            id="hidden-button-file"
            type="file"
            onChange={handleFileChange}
            aria-hidden="true"
          />
        </FlexDiv>
      </section>
    )
  };

  const QuizQuestions = () => {
    console.log(quizQuestions);
    return (
      <section aria-label="Quiz Questions">
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
          <Button id="add-new-question" variant="contained" onClick={addNewQuestion} aria-label="Add New Question Button">
            Add New Question
          </Button>
        </Box>
      </section>
    )
  };

  return (
    <main>
      <FlexDiv>
        <Button
          aria-labelledby="back-button"
          id="back-button"
          component={Link}
          to="/dashboard"
          aria-label="Back Button"
        >
          <ArrowBackIcon />
        </Button>
        <FormControl variant="standard" >
          <InputLabel htmlFor="game-name-input" aria-label="Game Name Input Label">
            Game Name
          </InputLabel>
          <Input
            id="game-name-input"
            name="game-name"
            type="text"
            value={quizName}
            autoFocus
            onChange={(event) => {
              setQuizName(event.target.value);
            }}
            onBlur={() => setUpdateName(!updateName)}
            sx={{
              fontSize: '2rem',
              marginBottom: '10px'
            }}
            aria-labelledby="game-name-input game-name-input-label"
          />
        </FormControl>
      </FlexDiv>
      <Divider sx={{ mb: 2 }}/>
      <Grid container>
        <Grid
          item
          xs={12}
          justifyContent="center"
          role="region"
          aria-label="Quiz Form and Questions Grid"
        >
          <QuizForm />
          <QuizQuestions />
        </Grid>
      </Grid>
      <footer>
        <Typography variant="subtitle2" align="center" sx={{ m: 5 }}>
          © 2023 VENTRICOLUMNA
        </Typography>
      </footer>
    </main>
  )
}
