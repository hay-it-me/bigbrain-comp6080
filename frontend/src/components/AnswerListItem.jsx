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
    onDelete();
  };

  return (
    <React.Fragment>
      <ListItem>
        <ListItemButton dense>
          <ListItemIcon onClick={updateChecked}>
            <Checkbox
              edge="start"
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
          <IconButton edge="end" aria-label="edit" onClick={editAnswer}>
            <EditIcon />
          </IconButton>
          <IconButton edge="end" aria-label="delete" onClick={deleteAnswer}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </React.Fragment>
  )
}
