import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Avatar,
  ListItemSecondaryAction
} from '@mui/material';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

import React from 'react';

export const QuestionListItem = ({ question, questionId, gameId, onDelete }) => {
  const deleteQuestion = () => {
    onDelete(true);
  };

  return (
    <React.Fragment>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <QuestionAnswerIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={question.question}
          secondary={Object.keys(question.answers).length + ' Choices'}
        />
        <ListItemSecondaryAction>
          <IconButton aria-label="edit" id={'edit-button-question-' + questionId} component={ Link } to={'/editgame/' + gameId + '/editquestion/' + questionId }>
            <EditIcon />
          </IconButton>
          <IconButton edge="end" id={'delete-button-question-' + questionId} aria-label="delete" onClick={deleteQuestion}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </React.Fragment>
  )
}
