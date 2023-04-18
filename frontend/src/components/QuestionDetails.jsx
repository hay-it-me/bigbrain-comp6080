import {
  Box,
  FormControl,
  Input,
  InputLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Divider,
  FormControlLabel,
  Typography,
  Button,
  styled,
  Skeleton
} from '@mui/material';
import { fileToDataUrl } from '../utilities/helpers';
import React from 'react';
import { useContext, Context } from '../context';

export const QuestionDetails = ({ question, setQuestion, points, setPoints, time, setTime, video, setVideo, img, setImg, mediaChoice, setMediaChoice }) => {
  const { setters } = useContext(Context);

  const HiddenFileInput = styled('input')({
    display: 'none',
  });

  const FlexDiv = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

  const BorderedImage = styled('img')({
    border: '1px solid black',
    maxWidth: '100%',
    maxHeight: '100px'
  });

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const dataUrl = await fileToDataUrl(file);
        setImg(dataUrl);
      } catch (error) {
        setters.setErrorMessage('Error occured whilst reading file');
        setters.setErrorOpen(true);
      }
    }
  };

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
    <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
      <Typography variant="h6" sx={{ marginTop: '20px' }}>
        Upload Media
      </Typography>
      <Divider />
      <FormControl>
        <FormLabel id="media-choice">Media Type</FormLabel>
        <RadioGroup
          row
          aria-labelled-by="media-choice"
          name="media-choice-group"
          value={mediaChoice}
          onChange={(event) => setMediaChoice(event.target.value)}
        >
          <FormControlLabel value="video" control={<Radio />} label="Video" />
          <FormControlLabel value="img" control={<Radio />} label="Image" />

        </RadioGroup>

      </FormControl>
    </Box>
    <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
      {mediaChoice === 'video' &&
        <FormControl variant="standard" sx={{ mt: 2 }}>
          <InputLabel htmlFor="video-url-question">Video URL</InputLabel>
          <Input
            id='video-url-question'
            value={video}
            type='text'
            onChange={(event) => {
              setVideo(event.target.value)
            }}
        />
        </FormControl>
        }
      {mediaChoice === 'img' &&
        <div>
          <HiddenFileInput
            accept="image/*"
            id="hidden-button-file"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="hidden-button-file">
            <Button variant="contained" component="span" sx={{ marginTop: '30px' }}>
              Upload Image
            </Button>
          </label>
        </div>
      }
    </Box>
    <FlexDiv>
      {img && mediaChoice === 'img' && (
        <>
          <BorderedImage src={img} alt="question-image" />
        </>
      )}
      {!img && mediaChoice === 'img' && (
        <>
          <Skeleton variant="rectangular" height={100} width={100}/>
        </>
      )}
    </FlexDiv>
  </React.Fragment>
  )
}
