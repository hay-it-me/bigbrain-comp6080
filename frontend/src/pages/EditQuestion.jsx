import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  styled
} from '@mui/material';

import { useParams } from 'react-router-dom';
import React from 'react';
import { useContext, Context } from '../context';
import { apiRequest } from '../utilities/helpers';
import DeleteIcon from '@mui/icons-material/Delete';

export const EditQuestion = () => {
  const [quiz, setQuiz] = React.useState({});
  const [quizQuestion, setQuizQuestion] = React.useState({
    question: '',
    type: '',
    answers: [''],
    correct: [],
    timelimit: 0,
    points: 0,
    videourl: '',
    photosrc: ''
  });
  const { getters, setters } = useContext(Context);

  const { gameId, questionId } = useParams();
  React.useEffect(async () => {
    console.log('a')
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${getters.token}`
      }
    };
    console.log('???')
    const data = await apiRequest('/admin/quiz/' + gameId, options)
    console.log(gameId);
    if (data.error) {
      setters.setErrorMessage(data.error);
      setters.setErrorOpen(true);
    } else if (questionId >= data.questions.length) {
      setters.setErrorMessage('Question does not exist');
      setters.setErrorOpen(true);
    } else {
      setQuiz(data);
      setQuizQuestion(data.questions[questionId]);
    }
  }, []);

  const FlexDiv = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  })

  const updateType = (event) => {
    setQuizQuestion({ ...quizQuestion, type: event.target.value });
  };
  console.log(updateType, quizQuestion)
  // const QuestionForm = () => {

  // }
  const addNewAnswer = () => {
    setQuizQuestion({ ...quizQuestion, answers: [...quizQuestion.answers, ''] });
    console.log(quizQuestion.answers)
  };
  const deleteAnswer = (event) => {
    console.log(event.currentTarget.id)
  };
  return (
    <>
      <FlexDiv>
        <Card>
          <CardHeader
            title={ quiz.name + ' Question ' + (Number(questionId) + 1) }
          />
          <CardContent>
            <InputLabel id='select-type-label'>Question Type</InputLabel>
            <Select
              labelId='select-type-label'
              value={quizQuestion.type}
              onChange={updateType}
            >
              <MenuItem value='single'>Single Answer</MenuItem>
              <MenuItem value='multiple'>Multiple Answer</MenuItem>
            </Select><br/>
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              direction="column"
              columns={2}
              // spacing={}
            >

            {quizQuestion.answers.map((answer, index) => {
              console.log('smth')
              return (
                <>
                  <Typography key={'answer-' + index}>{answer + 'asd'}</Typography>
                  <IconButton>
                    <DeleteIcon id={'delete-answer-' + index} edge="end" aria-label="delete" onClick={deleteAnswer}/>
                  </IconButton>
                </>)
            })}
            </Grid>
            <Button onClick={addNewAnswer}>Add Option</Button>
          </CardContent>
        </Card>
      </FlexDiv>

    </>
  )
}
