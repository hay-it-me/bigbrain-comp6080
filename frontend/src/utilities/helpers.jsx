import config from '../config.json';
import { styled } from '@mui/material';
export const apiRequest = async (path, options) => {
  const response = await fetch(`http://localhost:${config.BACKEND_PORT}` + path, options);
  return response.json();
};

// Helper function from Ass3
export function fileToDataUrl (file) {
  const dataUrlPromise = new Promise((resolve, reject) => {
    if (file === undefined) {
      // if no file specified we want the img src to be empty
      resolve('');
    }
    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
    const valid = validFileTypes.find(type => type === file.type);
    // Bad data, let's walk away.
    if (!valid) {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject('Provided file is not a png, jpg or jpeg image.');
    }
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
  return dataUrlPromise;
}

export function displayTime (seconds) {
  const timeUnits = [
    [1, 'second', 'seconds'],
    [60, 'minute', 'minutes'],
    [60 * 60, 'hour', 'hours'],
  ]
  let displayUnit = timeUnits[0];
  for (const unit of timeUnits) {
    if (seconds >= unit[0]) {
      displayUnit = unit;
    }
  }
  const [divisor, label, multiLabel] = displayUnit;
  console.log(Math.ceil(seconds / divisor) + (Math.ceil(seconds / divisor) === 1 ? label : multiLabel))
  return Math.ceil(seconds / divisor) + ' ' + (Math.ceil(seconds / divisor) === 1 ? label : multiLabel);
}

export const FlexDiv = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
})
