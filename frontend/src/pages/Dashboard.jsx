import {
  Snackbar,
  Alert,
  CardMedia,
  CardHeader,
  Card,
  CardContent,
  Typography
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import React from 'react';
import ResponsiveAppBar from '../components/Navbar';

export const Dashboard = ({ token }) => {
  const [quizzes, setQuizzes] = React.useState([]);
  const [errorOpen, setErrorOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  function logoutUser (logoutStatus) {
    console.log('penis');
  }

  const handleErrorClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorOpen(false);
  };

  React.useEffect(async function () {
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
  }, []);

  const quizCard = (quiz) => {
    <Card sx={{ maxWidth: 350 }}>
      <CardHeader
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={quiz.name}
        subheader={quiz.createdAt.toLocaleDateString('en-US')}
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
  };

  return (
    <>
      <Snackbar open={errorOpen} autoHideDuration={6000} onClose={handleErrorClose}>
        <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
      <ResponsiveAppBar onLogout={logoutUser} />
      {quizzes.map((quiz) => {
        return quizCard(quiz);
      })}
    </>
  )
}
