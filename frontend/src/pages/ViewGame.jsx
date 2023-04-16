import { useContext, Context } from '../context';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@mui/material';
// import { apiRequest } from '../utilities/helpers'

export const ViewGame = () => {
  const { getters, setters } = useContext(Context);

  const { quizId, sessionId } = useParams();

  console.log(getters, setters, sessionId, quizId);

  // const endGame = async () => {
  //   const optionsGet = {
  //     method: 'GET',
  //     headers: {
  //       accept: 'application/json',
  //       Authorization: `Bearer ${getters.token}`
  //     }
  //   };
  //   const dataGet = await apiRequest('/admin/quiz/' + quizId, optionsGet);
  //   if (dataGet.error) {
  //     setters.setErrorMessage(dataGet.error)
  //   } else {
  //     const options = {
  //       method: 'POST',
  //       headers: {
  //         accept: 'application/json',
  //         Authorization: `Bearer ${getters.token}`
  //       }
  //     };
  //     const data = await apiRequest('/admin/quiz/' + quizId + '/end', options);
  //     if (data.error) {
  //       setters.setErrorMessage(data.error)
  //     } else {
  //       setStartGameDialogOpen(false);
  //       setEndGameDialogOpen(true);
  //       setEndGameTitle(quizName);
  //       setSessionCode(dataGet.active)
  //       reRender(true);
  //     }
  //     // TODO
  //   }
  // }
  // console.log (endGame)
  return (
    <>
      <Button
      sx={{ marginTop: '30px' }}
      variant="outlined"
      onClick={() => console.log('te')}
      >
      Next Question
      </Button>
      <Button
      sx={{ marginTop: '30px' }}
      variant="outlined"
      onClick={() => console.log('te')}
      >
      End Game
      </Button>
    </>
  )
}
