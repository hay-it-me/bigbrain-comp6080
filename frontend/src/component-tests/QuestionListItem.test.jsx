import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuestionListItem } from '../components/QuestionListItem';
import React from 'react';
import { MemoryRouter } from 'react-router-dom'

const mockQuestion = {
  question: 'what',
  answers: [
    { answer: 'hi', correct: true }
  ]
};
const deleteCall = jest.fn();

describe('QuestionListItem', () => {
  it('Renders the correct elements', () => {
    render(
    <MemoryRouter>
      <QuestionListItem
        question={mockQuestion}
        questionId="0"
        gameId="999"
        onDelete={deleteCall}
      />
    </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  })

  it('Responds when subcomponents are clicked', () => {
    render(
      <MemoryRouter>
        <QuestionListItem
          question={mockQuestion}
          questionId="0"
          gameId="999"
          onDelete={deleteCall}
        />
      </MemoryRouter>
    )

    userEvent.click(screen.getByLabelText('delete'));
    expect(deleteCall).toHaveBeenCalledTimes(1);
  })
});
