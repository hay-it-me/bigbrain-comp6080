import React from 'react';
import ResponsiveAppBar from '../components/Navbar';

export const Quizzes = ({ onLogout }) => {
  function logoutUser () {
    onLogout(true);
  }

  return (
    <>
      <ResponsiveAppBar setLogout={() => logoutUser()} />
      List of quizzes here
    </>
  )
}
