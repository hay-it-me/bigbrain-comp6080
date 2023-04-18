import {
  IconButton,
  InputLabel,
  FormControl,
  Input,
  Typography,
  styled
} from '@mui/material';
import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

export const AnswerInput = ({ answerData, index, updateAnswer, deleteAnswer }) => {
  const [localAnswer, setLocalAnswer] = React.useState(answerData.answer);

  const FlexDiv = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

  const handleBlur = (event, index) => {
    updateAnswer(event, index);
  };

  return (
    <FlexDiv>
      <FormControl variant="standard">
        <InputLabel htmlFor={'answer-input-' + index} />
        <Input
          id={'answer-input-' + index}
          type="text"
          value={localAnswer}
          onChange={(event) => setLocalAnswer(event.target.value)}
          onBlur={(event) => handleBlur(event, index)}
        />
        <Typography>
          {index}
        </Typography>
      </FormControl>
      <IconButton
        id={'delete-answer-' + index}
        edge="end"
        aria-label="delete"
        onClick={() => deleteAnswer(index)}
      >
        <DeleteIcon />
      </IconButton>
    </FlexDiv>
  )
}
