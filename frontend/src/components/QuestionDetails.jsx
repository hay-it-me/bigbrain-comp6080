import {
  Box,
  FormControl,
  Input,
  InputLabel
} from '@mui/material'
import React from 'react'

export const QuestionDetails = ({ question, setQuestion, points, setPoints, time, setTime }) => {
  return (
  <React.Fragment>
    <Box>
        <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
        <InputLabel htmlFor="question-question">Question</InputLabel>
        <Input
          id='question-question'
          value={question}
          type='text'
          onChange={(event) => {
            setQuestion(event.target.value)
          }}
      />
        </FormControl>
    </Box>
    <Box sx={{ textAlign: 'center' }}>
        <FormControl variant="standard" sx={{ mt: 2 }}>
        <InputLabel htmlFor="points-question">Points</InputLabel>
        <Input
          id='points-question'
          value={points}
          type='number'
          onChange={(event) => {
            setPoints(event.target.value)
          }}
      />
        </FormControl>
    </Box>
    <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
        <FormControl variant="standard" sx={{ mt: 2 }}>
        <InputLabel htmlFor="time-question">Time Limit</InputLabel>
        <Input
          id='time-question'
          value={time}
          type='number'
          onChange={(event) => {
            setTime(event.target.value)
          }}
      />
        </FormControl>
    </Box>
  </React.Fragment>
  )
}
