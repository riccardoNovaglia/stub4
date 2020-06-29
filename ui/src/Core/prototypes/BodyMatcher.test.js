import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BodyMatcher } from './BodyMatcher';

it('allows configuring the body matcher after the checkbox is clicked', () => {
  const { getLatestState } = renderRequestMatcher();
  const bodyMatcher = screen.getByLabelText(/body matcher/i);
  userEvent.click(bodyMatcher);
  expect(screen.getByLabelText(/body matcher/i).checked).toBe(true);

  const typeOptions = screen.getByLabelText(/type/i);
  userEvent.selectOptions(typeOptions, 'xml');
  expect(screen.getByText(/xml/i).selected).toBe(true);
  expect(getLatestState()).toEqual({
    type: 'xml',
    body: ''
  });

  const bodyContentMatcher = screen.getByLabelText(/match$/i);
  userEvent.type(bodyContentMatcher, 'not really important for this test');

  expect(getLatestState()).toEqual({
    type: 'xml',
    body: 'not really important for this test'
  });
});

it('removes the body matcher if the checkbox is unchecked', () => {
  const { getLatestState } = renderRequestMatcher();
  userEvent.click(screen.getByLabelText(/body matcher/i));
  expect(screen.getByLabelText(/body matcher/i).checked).toBe(true);
  expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/match$/i)).toBeInTheDocument();
  expect(getLatestState()).toEqual({
    type: 'json',
    body: ''
  });

  userEvent.click(screen.getByLabelText(/body matcher/i));
  expect(screen.getByLabelText(/body matcher/i).checked).toBe(false);
  expect(screen.queryByLabelText(/type/i)).not.toBeInTheDocument();
  expect(screen.queryByLabelText(/match$/i)).not.toBeInTheDocument();
  expect(getLatestState()).toEqual(undefined);
});

function renderRequestMatcher(initialState = undefined) {
  let latestState = initialState;
  function setLatestState(state) {
    latestState = state;
  }
  function getLatestState() {
    return latestState;
  }

  render(<BodyMatcherTester setLatestState={setLatestState} initialState={latestState} />);

  return {
    getLatestState
  };
}

function BodyMatcherTester({ setLatestState, initialState }) {
  const [bodyMatcher, setBodyMatcher] = useState(initialState);

  return (
    <BodyMatcher
      bodyMatcher={bodyMatcher}
      onChange={(latestBodyMatcher) => {
        setBodyMatcher(latestBodyMatcher);
        setLatestState(latestBodyMatcher);
      }}
    />
  );
}
