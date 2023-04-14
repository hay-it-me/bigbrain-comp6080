import config from '../config.json';

export const apiRequest = async (path, options) => {
  const response = await fetch(`http://localhost:${config.BACKEND_PORT}` + path, options);
  return response.json();
};
