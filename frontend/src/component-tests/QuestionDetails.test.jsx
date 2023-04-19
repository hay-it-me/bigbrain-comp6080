import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuestionDetails } from '../components/QuestionDetails';
import React from 'react';

describe('Question Details', () => {
  it('Renders the correct elements', () => {
    render(<QuestionDetails />
    )

    expect(screen.getByRole('textbox', { name: /Question/i })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /Points/i })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /Time Limit/i })).toBeInTheDocument();
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Video/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Image/i })).toBeInTheDocument();
  })

  it('Renders details as valid if no errors and callsback when changed', () => {
    const inputs = {
      question: 'hello',
      points: 12,
      time: 10,
      mediaChoice: 'video'
    }
    const qCall = jest.fn();
    const pCall = jest.fn();
    const tCall = jest.fn();
    const smCall = jest.fn()

    render(<QuestionDetails
      question={''}
      points={0}
      time={0}
      mediaChoice={'img'}
      setQuestion={qCall}
      setPoints={pCall}
      setTime={tCall}
      setMediaChoice={smCall}
      />
    )

    userEvent.type(screen.getByRole('textbox', { name: /Question/i }), inputs.question);
    expect(screen.getByRole('textbox', { name: /Question/i })).toBeValid();
    expect(qCall).toHaveBeenCalledTimes(5);

    expect(screen.getByRole('radiogroup')).toBeValid();
    userEvent.click(screen.getByRole('radio', { name: /Video/i }));
    expect(smCall).toHaveBeenCalledTimes(1);
  });
});
