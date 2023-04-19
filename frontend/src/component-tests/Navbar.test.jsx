import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResponsiveAppBar from '../components/Navbar';
import React from 'react';
import { MemoryRouter } from 'react-router-dom'

const logoutCall = jest.fn();

describe('QuestionListItem', () => {
  it('Renders the correct elements', () => {
    render(
      <MemoryRouter>
        <ResponsiveAppBar setLogout={logoutCall}/>
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: /Dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Join Game/i })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Open settings/i })).toBeInTheDocument();
  })

  it('Logs out when logout is clicked', () => {
    render(
      <MemoryRouter>
        <ResponsiveAppBar setLogout={logoutCall}/>
      </MemoryRouter>
    )

    userEvent.click(screen.getByRole('button', { name: /Open settings/i }));
    userEvent.click(screen.getByText('Logout'));
    expect(logoutCall).toHaveBeenCalledTimes(1);
  })
});
