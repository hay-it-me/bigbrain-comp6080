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

import React from 'react';

export const QuestionListItem = ({ question }) => {
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
          <IconButton aria-label="edit">
            <EditIcon />
          </IconButton>
          <IconButton edge="end" aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </React.Fragment>
  )
}
