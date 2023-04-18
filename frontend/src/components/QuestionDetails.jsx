import { Box, FormControl, Input, InputLabel } from '@mui/material'
import React from 'react'

export const QuestionDetails = ({ question, setQuestion }) => {
  // const [question, setQuestion] = React.useState('');
  return (
  <React.Fragment>
    {/* <FlexDiv>
      <Typography variant="h4" sx={{ marginTop: '20px', marginBottom: '20px' }}>
        { quiz.name + ' Question ' + (Number(questionId) + 1) }
      </Typography>
    </FlexDiv> */}
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
    {/* <FlexDiv>
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
    </FlexDiv> */}
  </React.Fragment>
  )
}
