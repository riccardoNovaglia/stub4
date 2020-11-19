import { useState } from 'react';
import { render, screen, getNodeText } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RequestMatcher } from './RequestMatcher';

it('starts blank when given a blank matcher', () => {
  renderRequestMatcher();
  expect(getNodeText(screen.getByLabelText(/url/i))).toEqual('');
});

it('sets the url on the url matcher when typed', async () => {
  const { getLatestState } = renderRequestMatcher();
  await userEvent.type(screen.getByLabelText(/url/i), '/something');
  expect(getLatestState()).toEqual({ url: '/something' });
});

it('starts with the given url', async () => {
  renderRequestMatcher({
    url: '/pre-set'
  });
  expect(screen.getByLabelText(/url/i).value).toEqual('/pre-set');
});

it('shows the method matcher checkbox unchecked when the method matcher is not defined', () => {
  renderRequestMatcher();
  expect(screen.getByLabelText(/method matcher/i).checked).toBe(false);
});

it('shows the method matcher checkbox checked and the method if defined', () => {
  renderRequestMatcher({
    url: '',
    method: 'PATCH'
  });
  expect(screen.getByLabelText(/method matcher/i).checked).toBe(true);
  expect(screen.getByText(/patch/i).selected).toBe(true);
  expect(screen.getByText(/post/i).selected).toBe(false);
  expect(screen.getByText(/get/i).selected).toBe(false);
});

it('shows the header matchers checkbox unchecked when the headers matcher is not defined', () => {
  renderRequestMatcher();
  expect(screen.getByLabelText(/headers matcher/i).checked).toBe(false);
});

it('shows the headers matcher checkbox checked and the headers key/values if defined', () => {
  renderRequestMatcher({
    url: '',
    headers: { 'some-key': 'some-value' }
  });
  expect(screen.getByLabelText(/name/i).value).toEqual('some-key');
  expect(screen.getByLabelText(/value/i).value).toEqual('some-value');
});

it('starts with a button to add a body matcher when given an blank one', () => {
  renderRequestMatcher();
  screen.getByLabelText(/body matcher/i);
  expect(screen.getByLabelText(/body matcher/i).checked).toBe(false);
});

it('starts with the given body matcher configured if one is given', () => {
  renderRequestMatcher({
    url: '',
    body: { type: 'json', value: 'any text' }
  });
  expect(screen.getByLabelText(/body matcher/i).checked).toBe(true);
  expect(screen.getByText(/json/i).selected).toBe(true);
  expect(screen.getByText(/xml/i).selected).toBe(false);

  expect(getNodeText(screen.getByLabelText(/match$/i))).toEqual('any text');
});

const blankRequestMatcher = {
  url: ''
};

function renderRequestMatcher(initialState = blankRequestMatcher) {
  let latestState = {};
  function setLatestState(state) {
    latestState = state;
  }
  function getLatestState() {
    return latestState;
  }

  render(<RequestMatcherTester setLatestState={setLatestState} initialState={initialState} />);

  return {
    getLatestState
  };
}

function RequestMatcherTester({ setLatestState, initialState }) {
  const [requestMatcher, setRequestMatcher] = useState(initialState);

  return (
    <RequestMatcher
      requestMatcher={requestMatcher}
      setRequestMatcher={(latestRequestMatcher) => {
        setRequestMatcher(latestRequestMatcher);
        setLatestState(latestRequestMatcher);
      }}
    />
  );
}
