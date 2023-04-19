import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AnswerListItem } from '../components/AnswerListItem';
import React from 'react';

const mockAnswerData = {
  answer: 'test answer',
  correct: false
}

const deleteCall = jest.fn();
const checkedCall = jest.fn();
const editCall = jest.fn();

describe('AnswerListItem', () => {
  it('Renders the correct elements', () => {
    render(<AnswerListItem
      id="0"
      answerData={mockAnswerData}
      onDelete={deleteCall}
      onSetChecked={checkedCall}
      editAnswer={editCall} />
    )

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /test answer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeValid();
  })

  it('Updates when checked', () => {
    render(<AnswerListItem
      id="0"
      answerData={mockAnswerData}
      onDelete={deleteCall}
      onSetChecked={checkedCall}
      editAnswer={editCall} />
    )

    userEvent.click(screen.getByRole('checkbox'));
    expect(checkedCall).toHaveBeenCalledTimes(1);
    expect(checkedCall).toHaveBeenCalledWith(true);
  })

  it('Responds when subcomponents are clicked', () => {
    render(<AnswerListItem id="0"
      answerData={mockAnswerData}
      onDelete={deleteCall}
      onSetChecked={checkedCall}
      editAnswer={editCall} />
    )

    userEvent.click(screen.getByLabelText('edit'));
    expect(editCall).toHaveBeenCalledTimes(1);

    userEvent.click(screen.getByLabelText('delete'));
    expect(deleteCall).toHaveBeenCalledTimes(1);
  })
});
