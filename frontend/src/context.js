import React, { createContext } from 'react';

export const init = {
  token: localStorage.getItem('token'),
  errorOpen: false,
  errorMessage: ''
};

export const Context = createContext(init);
export const useContext = React.useContext;
