import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MethodMatcher } from './MethodMatcher';

it('sets the method matcher to the selected one after Add is checked', () => {
  const { getLatestState } = renderRequestMatcher();
  const addMethodMatcher = screen.getByLabelText(/method matcher/i);
  userEvent.click(addMethodMatcher);
  expect(getLatestState()).toEqual('GET');

  const methodOptions = screen.getByLabelText(/method$/i);
  userEvent.selectOptions(methodOptions, 'POST');

  expect(getLatestState()).toEqual('POST');
});

it('starts with the given method matcher selected if one is given', () => {
  renderRequestMatcher('PATCH');
  expect(screen.getByText(/patch/i).selected).toBe(true);
  expect(screen.getByText(/post/i).selected).toBe(false);
  expect(screen.getByText(/get/i).selected).toBe(false);
});

it('sets the method matcher back to undefined when Add is unchecked', () => {
  const { getLatestState } = renderRequestMatcher('DELETE');
  userEvent.click(screen.getByLabelText(/method matcher/i));
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

  render(<MethodMatcherTester setLatestState={setLatestState} initialState={latestState} />);

  return {
    getLatestState
  };
}

function MethodMatcherTester({ setLatestState, initialState }) {
  const [methodMatcher, setMethodMatcher] = useState(initialState);

  return (
    <MethodMatcher
      methodMatcher={methodMatcher}
      onChange={(latestMethodMatcher) => {
        setMethodMatcher(latestMethodMatcher);
        setLatestState(latestMethodMatcher);
      }}
    />
  );
}
