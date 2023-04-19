import {
  Button,
  InputLabel,
  MenuItem,
  Select,
  styled,
  FormControl,
  Input,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Box,
  Typography,
  Divider,
  List,
  Grid
} from '@mui/material';
// import { AnswerInput } from '../components/AnswerInput';
import { useParams, Link, useNavigate } from 'react-router-dom';
import React from 'react';
import { useContext, Context } from '../context';
import { apiRequest } from '../utilities/helpers';
import { AnswerListItem } from '../components/AnswerListItem'
import { QuestionDetails } from '../components/QuestionDetails';

export const EditQuestion = () => {
  const [quiz, setQuiz] = React.useState({});
  const [quizQuestion, setQuizQuestion] = React.useState({
    question: '',
    type: '',
    answers: [],
    timelimit: 0,
    points: 0,
    videourl: '',
    photosrc: ''
  });
  const [question, setQuestion] = React.useState('');
  const [points, setPoints] = React.useState(0);
  const [time, setTime] = React.useState(0);
  const [video, setVideo] = React.useState('');
  const [img, setImg] = React.useState('');
  const [mediaChoice, setMediaChoice] = React.useState('img')

  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [dialogAnswer, setDialogAnswer] = React.useState('');

  const { getters, setters } = useContext(Context);
  const { gameId, questionId } = useParams();
  const navigate = useNavigate();

  React.useEffect(async () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${getters.token}`
      }
    };
    const data = await apiRequest('/admin/quiz/' + gameId, options)
    if (data.error) {
      setters.setErrorMessage(data.error);
      setters.setErrorOpen(true);
    } else if (questionId >= data.questions.length) {
      setters.setErrorMessage('Question does not exist');
      setters.setErrorOpen(true);
    } else {
      setQuiz(data);
      setQuizQuestion(data.questions[questionId]);
      setQuestion(data.questions[questionId].question);
      setPoints(parseInt(data.questions[questionId].points));
      setTime(parseInt(data.questions[questionId].timelimit));
      setVideo(data.questions[questionId].videourl);
      setImg(data.questions[questionId].photosrc);
      if (data.questions[questionId].videourl) {
        setMediaChoice('video');
      }
    }
  }, []);

  const FlexDiv = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

  const openAddDialog = () => {
    setAddDialogOpen(true);
  };

  const closeAddDialog = () => {
    setAddDialogOpen(false);
    setDialogAnswer('');
  };

  const updateType = (event) => {
    setQuizQuestion({ ...quizQuestion, type: event.target.value });
  };

  const addNewAnswer = () => {
    setQuizQuestion((quizQuestion) => ({
      ...quizQuestion,
      answers: [...quizQuestion.answers, { answer: dialogAnswer, correct: false }]
    }));
    closeAddDialog();
  };

  const deleteAnswer = (index) => {
    setQuizQuestion(quizQuestion => (
      {
        ...quizQuestion,
        answers:
          quizQuestion.answers.filter((_, i) =>
            i !== index
          )
      }
    ));
  };

  async function saveQuestion () {
    console.log('SV')
    const correctAnswers = quizQuestion.answers.filter((answer) =>
      answer.correct === true
    ).length

    if (quizQuestion.type === 'single' && correctAnswers !== 1) {
      setters.setErrorMessage('Single choice must have 1 correct answer');
      setters.setErrorOpen(true);
      return;
    } else if (quizQuestion.type === 'multiple' && correctAnswers < 1) {
      setters.setErrorMessage('Multiple choice must have at least 1 correct answer');
      setters.setErrorOpen(true);
      return;
    }

    const videoUrl = mediaChoice === 'video' ? video : '';
    const imgSrc = mediaChoice === 'img' ? img : '';

    const questionList = Array.from(quiz.questions);
    const newQuestion = ({
      question,
      type: quizQuestion.type,
      answers: quizQuestion.answers,
      timelimit: time,
      points,
      videourl: videoUrl,
      photosrc: imgSrc
    });
    questionList[questionId] = newQuestion;
    const options = {
      method: 'PUT',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getters.token}`
      },
      body: JSON.stringify({
        name: quiz.name,
        thumbnail: quiz.thumbnail,
        questions: questionList
      })
    };
    const data = await apiRequest('/admin/quiz/' + gameId, options)

    if (data.error) {
      setters.setErrorMessage(data.error);
      setters.setErrorOpen(true);
    } else {
      navigate('/editgame/' + gameId);
    }
  }

  const updateChecked = (value, index) => {
    setQuizQuestion(quizQuestion => {
      const newAnswer = Array.from(quizQuestion.answers);
      newAnswer[index].correct = value;
      return { ...quizQuestion, answers: newAnswer };
    })
  }

  // const AnswerInput = ({ answerData, index }) => {
  //   return (
  //     <FlexDiv>
  //       <FormControl variant="standard" >
  //         <InputLabel htmlFor={'answer-input-' + index} />
  //         <Input
  //           id={'answer-input-' + index}
  //           type="text"
  //           value={answerData.answer}
  //           onChange={(event) => updateAnswer(event, index)}
  //         />
  //         <Typography>
  //           {index}
  //         </Typography>
  //       </FormControl>
  //       <IconButton>
  //         <DeleteIcon id={'delete-answer-' + index} edge="end" aria-label="delete" onClick={() => deleteAnswer(index)}/>
  //       </IconButton>
  //     </FlexDiv>
  //   )
  // }

  // const QuizAnswers = () => {
  //   return (
  //     <>
  //       {quizQuestion && quizQuestion.answers.map((answerData, index) => {
  //         console.log(answerData);
  //         console.log(index);
  //         return (
  //           <FlexDiv key={index}>
  //             <FormControl variant="standard">
  //               <InputLabel htmlFor={'answer-input-' + index} />
  //               <Input
  //                 id={'answer-input-' + index}
  //                 type="text"
  //                 value={answerData.answer}
  //                 onChange={(event) => updateAnswer(event.target.value, index)}
  //               />
  //               <Typography>
  //                 {index}
  //               </Typography>
  //             </FormControl>
  //             <IconButton
  //               id={'delete-answer-' + index}
  //               edge="end"
  //               aria-label="delete"
  //               onClick={() => deleteAnswer(index)}
  //             >
  //               <DeleteIcon />
  //             </IconButton>
  //           </FlexDiv>
  //         )
  //       })}
  //     </>
  //   )
  // }

  const QuizAnswers = () => {
    return (
      <>
        <Box sx={{ maxWidth: '500px', width: '100%' }}>
          <Typography variant="h6" sx={{ marginTop: '20px' }} id="answers-heading">
            Answers
          </Typography>
        <Typography variant="caption">
          Select the correct answers
        </Typography>
          <Divider />
          <List>
            {quizQuestion.answers &&
              quizQuestion.answers.map((answer, index) => {
                return (
                  <AnswerListItem
                    key={index}
                    id={index}
                    answerData={answer}
                    onSetChecked={(value) => updateChecked(value, index)}
                    onDelete={() => deleteAnswer(index)}
                  />
                );
              })}
          </List>
          <Button onClick={openAddDialog} aria-label="Add Option">
            Add Option
          </Button>
        </Box>
      </>
    )
  };

  return (
    <>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item xs={12} sm={6}>
          <Box sx={{ mt: 5, minWidth: 275 }}>
          <FlexDiv>
            <Typography variant="h4" sx={{ marginBottom: '20px' }}>
              { quiz.name}
            </Typography>
          </FlexDiv>
          <FlexDiv>
            <Typography variant="h6" sx={{ marginBottom: '20px' }}>
              { 'Question ' + (Number(questionId) + 1) }
            </Typography>
          </FlexDiv>
            <QuestionDetails
              question={question}
              setQuestion={setQuestion}
              points={points}
              setPoints={setPoints}
              time={time}
              setTime={setTime}
              mediaChoice={mediaChoice}
              setMediaChoice={setMediaChoice}
              img={img}
              setImg={setImg}
              video={video}
              setVideo={setVideo}
            />
          </Box>
        </Grid>
      </Grid>
      <FlexDiv>
        <div>
          <InputLabel id='select-type-label'>Question Type</InputLabel>
          <Select
            labelId='select-type-label'
            value={quizQuestion.type}
            onChange={updateType}
          >
            <MenuItem value='single'>Single Answer</MenuItem>
            <MenuItem value='multiple'>Multiple Answer</MenuItem>
          </Select>
        </div>
      </FlexDiv>
      <FlexDiv>
        <QuizAnswers />
      </FlexDiv>
      <FlexDiv sx={{ paddingTop: '50px' }}>
        <Button variant="contained" sx={{ marginRight: '10px' }} onClick={() => saveQuestion()}>
          Save Question
        </Button>
        <Button variant="contained" component={Link} to={'/editgame/' + gameId} sx={{ marginLeft: '10px' }}>
          Cancel
        </Button>
      </FlexDiv>
      <Dialog
        open={addDialogOpen}
        onClose={closeAddDialog}
      >
        <DialogTitle>
          New Answer
        </DialogTitle>
        <DialogContent>
          <FormControl variant="standard">
            <InputLabel htmlFor="answer-input">
              Answer
            </InputLabel>
            <Input
              id="answer-input"
              type="text"
              value={dialogAnswer}
              onChange={(event) => setDialogAnswer(event.target.value)}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAddDialog}>Cancel</Button>
          <Button onClick={() => addNewAnswer()}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
