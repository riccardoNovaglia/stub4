import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BodyMatcher } from './BodyMatcher';

it('renders just the un-checked checkbox if a body matcher is not provided', () => {
  renderRequestMatcher(undefined);
  expect(screen.getByLabelText(/body matcher/i).checked).toBe(false);
});

it('renders the given values when provided', () => {
  renderRequestMatcher({ value: { id: '321' }, type: 'xml' });
  expect(screen.getByLabelText(/body matcher/i).checked).toBe(true);
  expect(screen.getByLabelText(/match$/i).value).toEqual('{"id":"321"}');
  expect(screen.getByLabelText(/type/i).value).toEqual('xml');
});

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
    value: ''
  });

  const bodyContentMatcher = screen.getByLabelText(/match$/i);
  userEvent.type(bodyContentMatcher, 'not really important for this test');

  expect(getLatestState()).toEqual({
    type: 'xml',
    value: 'not really important for this test'
  });
});

it('correctly handles json typed in the body matcher box', () => {
  const { getLatestState } = renderRequestMatcher({ value: { id: '' }, type: 'json' });
  const bodyContentMatcher = screen.getByLabelText(/match$/i);
  expect(bodyContentMatcher.value).toEqual('{"id":""}');
  expect(getLatestState()).toEqual({
    type: 'json',
    value: { id: '' }
  });

  userEvent.clear(bodyContentMatcher);
  userEvent.type(bodyContentMatcher, '{"msg": "this should work"}');
  expect(getLatestState()).toEqual({
    type: 'json',
    value: { msg: 'this should work' }
  });

  userEvent.clear(bodyContentMatcher);
  userEvent.type(bodyContentMatcher, '{"this is not valid json!!');
  expect(getLatestState()).toEqual({
    type: 'json',
    value: '{"this is not valid json!!'
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
    value: ''
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
