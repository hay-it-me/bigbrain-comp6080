import { useContext, Context } from '../context';
import React from 'react';

export const ViewGame = () => {
  const { getters, setters } = useContext(Context);
  console.log(getters, setters);

  return (
    <>
        yay
    </>
  )
}
