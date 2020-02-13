import React from 'react';
import { render, screen, wait } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { when, resetAllWhenMocks } from 'jest-when';

import { stubFor as mockedStub4 } from '@stub4/client';
import { NewStub } from './NewStub';

const onClose = jest.fn();
const onSaved = jest.fn();
const noEditedItem = undefined;

jest.mock('@stub4/client', () => ({ stubFor: jest.fn() }));
beforeEach(() => {
  jest.resetAllMocks();
  resetAllWhenMocks();
});

it('renders with a few default values', async () => {
  renderNewStub();

  expect(screen.getByLabelText('URL').value).toEqual('');
  expect(screen.getByLabelText('METHOD').value).toEqual('GET');
  expect(screen.getByLabelText('Body matching').checked).toEqual(false);

  expect(screen.getByLabelText('STATUS').value).toEqual('200');
  expect(screen.getByLabelText('TYPE').value).toEqual('application/json');
  expect(screen.getByLabelText('BODY').value).toEqual('{}');
});

it('calls stub4 with the right parameters given the default values', async () => {
  when(mockedStub4)
    .expectCalledWith(
      {
        url: '',
        method: 'GET'
      },
      { body: '{}', statusCode: 200, type: 'application/json' }
    )
    .mockResolvedValue();
  const { theStubWasSavedSuccessfully } = renderNewStub();

  userEvent.click(screen.getByText('Save'));

  await wait(() => expect(theStubWasSavedSuccessfully()));
});

it('allows changing values and calls stub4 correspondingly', async () => {
  when(mockedStub4)
    .expectCalledWith(
      {
        url: '/some-url',
        method: 'POST'
      },
      { body: 'this is the body', statusCode: '321', type: 'application/json' }
    )
    .mockResolvedValue();
  const { theStubWasSavedSuccessfully } = renderNewStub();

  userEvent.type(screen.getByLabelText('URL'), 'some-url');
  userEvent.selectOptions(screen.getByLabelText('METHOD'), 'POST');

  userEvent.type(screen.getByLabelText('STATUS'), '321');
  userEvent.type(screen.getByLabelText('BODY'), 'this is the body');
  userEvent.selectOptions(screen.getByLabelText('TYPE'), 'application/json');

  userEvent.click(screen.getByText('Save'));

  await wait(() => expect(theStubWasSavedSuccessfully()));
});

it('allows updating the body matcher once it is selected', async () => {
  when(mockedStub4)
    .expectCalledWith(
      {
        url: '/with-body',
        method: 'POST',
        bodyMatcher: { id: '321' },
        type: 'json'
      },
      { body: '{}', statusCode: 200, type: 'application/json' }
    )
    .mockResolvedValue();
  const { theStubWasSavedSuccessfully } = renderNewStub();

  userEvent.type(screen.getByLabelText('URL'), 'with-body');
  userEvent.selectOptions(screen.getByLabelText('METHOD'), 'POST');
  userEvent.click(screen.getByLabelText('Body matching'));

  userEvent.type(screen.getByLabelText('BODY MATCHER'), '{"id": "321"}');

  userEvent.click(screen.getByText('Save'));

  await wait(() => expect(theStubWasSavedSuccessfully()));
});

it('picks values from an edited stub overwriting the defaults', async () => {
  when(mockedStub4)
    .expectCalledWith(
      {
        url: '/some-random-url',
        method: 'POST'
      },
      { body: 'some-value that was setup', statusCode: 543, type: 'application/json' }
    )
    .mockResolvedValue();
  const { theStubWasSavedSuccessfully } = renderNewStub({
    urlMatcher: { url: '/some-random-url' },
    method: 'POST',
    response: {
      statusCode: 543,
      contentType: 'application/json',
      body: 'some-value that was setup'
    }
  });

  userEvent.click(screen.getByText('Save'));

  await wait(() => expect(theStubWasSavedSuccessfully()));
});

it('includes the body matching if present', async () => {
  when(mockedStub4)
    .expectCalledWith(
      {
        url: '/with-body',
        method: 'GET',
        bodyMatcher: { id: '321' },
        type: 'xml'
      },
      { body: '{}', statusCode: 200, type: 'text' }
    )
    .mockResolvedValue();
  const { theStubWasSavedSuccessfully } = renderNewStub({
    urlMatcher: { url: '/with-body' },
    bodyMatcher: { body: { id: '321' }, type: 'xml' },
    method: 'GET',
    response: {
      statusCode: 200,
      contentType: 'text',
      body: '{}'
    }
  });

  userEvent.click(screen.getByText('Save'));

  await wait(() => expect(theStubWasSavedSuccessfully()));
});

it('sets the value from the edited stub in the form', async () => {
  renderNewStub({
    urlMatcher: { url: '/some-random-url' },
    method: 'POST',
    response: {
      statusCode: 543,
      contentType: 'application/json',
      body: 'some-value that was setup'
    }
  });

  expect(screen.getByLabelText('URL').value).toEqual('/some-random-url');
  expect(screen.getByLabelText('METHOD').value).toEqual('POST');
  expect(screen.getByLabelText('Body matching').checked).toEqual(false);

  expect(screen.getByLabelText('STATUS').value).toEqual('543');
  expect(screen.getByLabelText('TYPE').value).toEqual('application/json');
  expect(screen.getByLabelText('BODY').value).toEqual('some-value that was setup');
});

it('sets the value from the edited stub in the form, including the body matcher if present', async () => {
  renderNewStub({
    urlMatcher: { url: '/body-match' },
    method: 'POST',
    bodyMatcher: { body: { id: 321 }, keys: ['id'], type: 'json' },
    response: {
      body: { mgs: 'User 321 created' },
      contentType: 'application/json',
      statusCode: 200
    }
  });

  expect(screen.getByLabelText('URL').value).toEqual('/body-match');
  expect(screen.getByLabelText('BODY').value).toEqual('{"mgs":"User 321 created"}');
  expect(screen.getByLabelText('Body matching').checked).toEqual(true);
  expect(screen.getByLabelText('BODY TYPE').value).toEqual('json');
  expect(screen.getByLabelText('BODY MATCHER').value).toEqual('{"id":321}');
});

function renderNewStub(editedItem = noEditedItem) {
  const container = render(<NewStub onClose={onClose} onSaved={onSaved} editedItem={editedItem} />);
  return {
    ...container,
    theStubWasSavedSuccessfully() {
      expect(mockedStub4).toHaveBeenCalled();
      expect(onSaved).toHaveBeenCalled();
    }
  };
}
