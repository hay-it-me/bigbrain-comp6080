import React from 'react';
import ResponsiveAppBar from '../components/Navbar';

export const Quizzes = ({ onLogout }) => {
  // Passes logout params to parent component
  const [isLoggedOut, setLoggedOut] = React.useState(false);
  function logoutUser (logoutStatus) {
    setLoggedOut(logoutStatus)
    onLogout(isLoggedOut);
  }

  return (
    <>
      <ResponsiveAppBar onLogout={logoutUser} />
      List of quizzes here
    </>
  )
}
