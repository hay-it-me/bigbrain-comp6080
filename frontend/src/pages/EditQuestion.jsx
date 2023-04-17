import {
  Card,
  CardHeader,
  Typography,
  styled
} from '@mui/material';

import { useParams } from 'react-router-dom';
import React from 'react';
import { useContext, Context } from '../context';
import { apiRequest } from '../utilities/helpers';

export const EditQuestion = () => {
  const [quiz, setQuiz] = React.useState(null);
  const [quizQuestion, setQuizQuestion] = React.useState(null);
  const { getters, setters } = useContext(Context);
  const { gameId, questionId } = useParams();

  React.useEffect(async () => {
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
      console.log(quizQuestion);
    }
  }, []);

  const FlexDiv = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  })

  // const QuestionForm = () => {

  // }

  return (
    <>
      <FlexDiv>
        <Card>
          <CardHeader>
            <Typography variant='h6'>
              {quiz.name + ' Question ' + (questionId + 1)}
            </Typography>
          </CardHeader>
        </Card>
      </FlexDiv>

    </>
  )
}
