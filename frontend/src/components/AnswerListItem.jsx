import {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  IconButton,
  Checkbox,
  ListItemSecondaryAction
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import React from 'react';

export const AnswerListItem = ({ id, answerData, onDelete, onSetChecked, editAnswer }) => {
  const updateChecked = () => {
    onSetChecked(!answerData.correct);
  }

  const deleteAnswer = () => {
    onDelete(true);
  };

  return (
    <React.Fragment>
      <ListItem>
        <ListItemButton dense>
          <ListItemIcon onClick={updateChecked}>
            <Checkbox
              edge="start"
              name="correct"
              checked={answerData.correct}
              tabIndex={-1}
              disableRipple
            />
          </ListItemIcon>
          <ListItemText
          id={id}
          primary={answerData.answer}
          />
        </ListItemButton>
        <ListItemSecondaryAction>
          <IconButton edge="end" id={'edit-button-answer-' + id} aria-label="edit" onClick={editAnswer}>
            <EditIcon />
          </IconButton>
          <IconButton edge="end" id={'delete-button-answer-' + id} aria-label="delete" onClick={deleteAnswer}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </React.Fragment>
  )
}
