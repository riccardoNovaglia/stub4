import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HeadersMatcher } from './HeadersMatcher';

it('checks the matcher button and adds empty inputs when clicked, removes them and unchecks when unclicked again', () => {
  renderRequestMatcher();

  userEvent.click(screen.getByLabelText(/headers matcher/i));
  expect(screen.getByLabelText(/headers matcher/i).checked).toBe(true);
  expect(screen.getByLabelText(/name/i).value).toEqual('');
  expect(screen.getByLabelText(/value/i).value).toEqual('');

  userEvent.click(screen.getByLabelText(/headers matcher/i));
  expect(screen.getByLabelText(/headers matcher/i).checked).toBe(false);
  expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
  expect(screen.queryByLabelText(/value/i)).not.toBeInTheDocument();
});

it("adds an empty key/value input, but doesn't set it until it's confirmed", () => {
  const { getLatestState } = renderRequestMatcher();

  userEvent.click(screen.getByLabelText(/headers matcher/i));
  expect(getLatestState()).toEqual({});
  expect(screen.getByLabelText(/name/i).value).toEqual('');
  expect(screen.getByLabelText(/value/i).value).toEqual('');
  expect(getLatestState()).toEqual({});

  userEvent.type(screen.getByLabelText(/name/i), 'header-name');
  userEvent.type(screen.getByLabelText(/value/i), 'header-value');
  userEvent.click(screen.getByText(/confirm/i));
  expect(getLatestState()).toEqual({
    'header-name': 'header-value'
  });
});

it('starts with ALL the given headers key/values when they are set', () => {
  renderRequestMatcher({ 'some-key': 'some-value', 'some-other-key': 'some-other-value' });
  expect(screen.getAllByLabelText(/name/i).map((item) => item.value)).toEqual([
    'some-key',
    'some-other-key'
  ]);
  expect(screen.getAllByLabelText(/value/i).map((item) => item.value)).toEqual([
    'some-value',
    'some-other-value'
  ]);
});

it("adds an empty key/value input, but doesn't set it until it's confirmed", () => {
  const { getLatestState } = renderRequestMatcher();

  userEvent.click(screen.getByLabelText(/headers matcher/i));
  expect(getLatestState()).toEqual({});
  expect(screen.getByLabelText(/name/i).value).toEqual('');
  expect(screen.getByLabelText(/value/i).value).toEqual('');
  expect(getLatestState()).toEqual({});

  userEvent.type(screen.getByLabelText(/name/i), 'header-name');
  userEvent.type(screen.getByLabelText(/value/i), 'header-value');
  userEvent.click(screen.getByText(/confirm/i));
  expect(getLatestState()).toEqual({
    'header-name': 'header-value'
  });
});

it('removes the new key/value inputs if cancelled', async () => {
  const { getLatestState } = renderRequestMatcher();

  userEvent.click(screen.getByLabelText(/headers matcher/i));
  userEvent.click(screen.getByText(/cancel/i));
  expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
  expect(screen.queryByLabelText(/value/i)).not.toBeInTheDocument();
  expect(getLatestState()).toEqual({});
  await waitFor(() => expect(screen.getByLabelText(/headers matcher/i).checked).toBe(false));
});

it('removes existing key/values when the remove button is pressed', () => {
  const { getLatestState } = renderRequestMatcher({
    'some-key': 'some-value'
  });

  userEvent.click(screen.getByText(/remove/i));
  expect(getLatestState()).toEqual({});
});

it('unchecks the checkbox if the last matcher item is removed', () => {
  const { getLatestState } = renderRequestMatcher({
    'header-name': 'header-value'
  });

  userEvent.click(screen.getByText(/remove/i));
  expect(getLatestState()).toEqual({});
  expect(screen.getByLabelText(/headers matcher/i).checked).toBe(false);
});

function renderRequestMatcher(initialState = undefined) {
  let latestState = {};
  function setLatestState(state) {
    latestState = state;
  }
  function getLatestState() {
    return latestState;
  }

  render(<HeadersMatcherTest setLatestState={setLatestState} initialState={initialState} />);

  return {
    getLatestState
  };
}

function HeadersMatcherTest({ setLatestState, initialState }) {
  const [headersMatcher, setHeadersMatcher] = useState(initialState);

  return (
    <HeadersMatcher
      headersMatcher={headersMatcher}
      onChange={(latestHeadersMatcher) => {
        setHeadersMatcher(latestHeadersMatcher);
        setLatestState(latestHeadersMatcher);
      }}
    />
  );
}
