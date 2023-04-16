import React from 'react';
import {
  CardMedia,
  CardHeader,
  Card,
  CardContent,
  Typography,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import { apiRequest } from '../utilities/helpers'
import { Link } from 'react-router-dom';

// Creates all the quiz cards on the dashboard
export const QuizCard = ({ quiz, token, onDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const openDeleteGameDialog = () => {
    handleCloseMenu();
    setDeleteDialogOpen(true);
  }

  const closeDeleteGameDialog = () => {
    setDeleteDialogOpen(false);
  }

  async function deleteGame () {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({})
    };
    const data = await apiRequest('/admin/quiz/' + quiz.id, options)
    closeDeleteGameDialog();
    if (data.error) {
      // setErrorMessage(data.error);
      // setErrorOpen(true);
    } else {
      onDelete(true);
    }
  }

  return (
    <>
      <Card key={quiz.id} sx={{ minWidth: 300, maxWidth: 350, margin: 2 }}>
        <CardHeader
          action={
            <>
              <IconButton
                aria-label={quiz.name + '-settings'}
                aria-controls={quiz.id + '-menu-button'}
                aria-haspopup="true"
                onClick={handleOpenMenu}
                color="inherit"
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id={quiz.id + '-menu-button'}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                sx={{
                  display: { xs: 'block' },
                }}
              >
                <MenuItem key='Edit Game' onClick={handleCloseMenu} component={Link} to={'/editgame/' + quiz.id}>
                      <Typography textAlign="center">Edit Game</Typography>
                  </MenuItem>
                <MenuItem key='Delete Game' onClick={openDeleteGameDialog} >
                    <Typography textAlign="center" color="red">Delete Game</Typography>
                </MenuItem>
              </Menu>
            </>
          }
          title={quiz.name}
          subheader={new Date(quiz.createdAt).toLocaleDateString('en-US')}
        />
        <CardMedia
            component="img"
            height="200"
            image={quiz.thumbnail}
            alt={quiz.name + ' thumbnail'}
        />
        <CardContent>
            <Typography
            variant="body1"
            color="text.secondary"
            >
            {quiz.owner}
            </Typography>
            {quiz.questions
              ? <Typography
              variant="body1"
              color="text.secondary"
            >
            {Object.keys(quiz.questions).length} Questions
            Time to Complete: PLACEHOLDER TXT
            </Typography>
              : <Typography
              variant="body1"
              color="text.secondary"
            >
              No Questions
            </Typography>
            }
        </CardContent>
      </Card>
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteGameDialog}
      >
        <DialogTitle>
          Delete {quiz.name}
        </DialogTitle>
        <DialogContent>
          <Typography
            variant='body2'>
              Are you sure you want to delete this game?
              This cannot be undone.
            </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteGameDialog}>Cancel</Button>
          <Button onClick={deleteGame}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
