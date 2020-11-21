import { screen, waitFor, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { when, resetAllWhenMocks } from 'jest-when';

import { stubFor as mockedStub4 } from '@stub4/client';
import { StubEditor } from './StubEditor';
import { renderWithRouter } from '../../setupTests';

const onClose = jest.fn();
const onSaved = jest.fn();
const noEditedItem = undefined;

jest.mock('@stub4/client', () => ({ stubFor: jest.fn(), stubs: { setEnabled: jest.fn() } }));
beforeEach(() => {
  jest.resetAllMocks();
  resetAllWhenMocks();
});

it('renders with a few default values', async () => {
  renderStubEditor();

  expect(screen.getByLabelText(/URL/i).value).toEqual('');
  expect(screen.getByLabelText(/METHOD MATCHER/i).checked).toEqual(false);
  expect(screen.getByLabelText(/HEADERS MATCHER/i).checked).toEqual(false);
  expect(screen.getByLabelText(/BODY MATCHER/i).checked).toEqual(false);

  expect(screen.getByLabelText(/STATUS/i).value).toEqual('200');
  expect(screen.getByLabelText(/TYPE/i).value).toEqual('application/json');
  expect(screen.getByLabelText(/BODY$/i).value).toEqual('{}');
});

it('calls stub4 with the right parameters given the default values', async () => {
  when(mockedStub4)
    .expectCalledWith({
      requestMatcher: {
        url: ''
      },
      response: {
        body: '{}',
        statusCode: 200,
        type: 'application/json'
      }
    })
    .mockResolvedValue();
  const { theStubWasSavedSuccessfully } = renderStubEditor();

  userEvent.click(screen.getByText('Save'));

  await waitFor(() => expect(theStubWasSavedSuccessfully()));
});

it('allows changing values and calls stub4 correspondingly', async () => {
  when(mockedStub4)
    .expectCalledWith({
      requestMatcher: {
        url: '/some-url',
        method: 'POST'
      },
      response: {
        body: 'this is the body',
        statusCode: '321',
        type: 'application/json'
      }
    })
    .mockResolvedValue();
  const { theStubWasSavedSuccessfully } = renderStubEditor();

  await userEvent.type(screen.getByLabelText(/URL/i), 'some-url');
  userEvent.click(screen.getByLabelText(/METHOD MATCHER/i));
  userEvent.selectOptions(screen.getByLabelText(/METHOD$/i), 'POST');

  await clearInput(screen.getByLabelText(/STATUS/i));
  await userEvent.type(screen.getByLabelText(/STATUS/i), '321');
  await clearInput(screen.getByLabelText(/BODY$/i));
  await userEvent.type(screen.getByLabelText(/BODY$/i), 'this is the body');
  userEvent.selectOptions(screen.getByLabelText(/TYPE/i), 'application/json');

  userEvent.click(screen.getByText(/Save/i));

  await waitFor(() => expect(theStubWasSavedSuccessfully()));
});

it('picks values from an edited stub overwriting the defaults', async () => {
  when(mockedStub4)
    .expectCalledWith({
      requestMatcher: {
        url: '/some-random-url',
        method: 'POST',
        body: { value: 'something', type: 'xml' }
      },
      response: {
        statusCode: 543,
        type: 'application/json',
        body: 'some-value that was setup'
      }
    })
    .mockResolvedValue();
  const { theStubWasSavedSuccessfully } = renderStubEditor({
    requestMatcher: {
      url: '/some-random-url',
      method: 'POST',
      body: { value: 'something', type: 'xml' }
    },
    response: {
      statusCode: 543,
      type: 'application/json',
      body: 'some-value that was setup'
    }
  });

  userEvent.click(screen.getByText('Save'));

  await waitFor(() => expect(theStubWasSavedSuccessfully()));
});

it('sets the value from the edited stub in the form', async () => {
  renderStubEditor({
    requestMatcher: {
      url: '/some-random-url',
      method: 'POST',
      body: { value: 'something', type: 'json' }
    },
    response: {
      statusCode: 543,
      type: 'application/json',
      body: 'some-value that was setup'
    }
  });

  const requestMatcherForm = screen.getByLabelText(/request matching/i);
  expect(within(requestMatcherForm).getByLabelText(/URL/i).value).toEqual('/some-random-url');
  expect(within(requestMatcherForm).getByLabelText(/METHOD$/i).value).toEqual('POST');
  expect(within(requestMatcherForm).getByLabelText(/MATCH$/i).value).toEqual('something');

  const responseForm = screen.getByLabelText(/response/i);
  expect(within(responseForm).getByLabelText(/STATUS/i).value).toEqual('543');
  expect(within(responseForm).getByLabelText(/TYPE/i).value).toEqual('application/json');
  expect(within(responseForm).getByLabelText(/BODY/i).value).toEqual('some-value that was setup');
});

function renderStubEditor(editedItem = noEditedItem) {
  const container = renderWithRouter(
    <StubEditor onClose={onClose} onSaved={onSaved} editedItem={editedItem} />
  );
  return {
    ...container,
    theStubWasSavedSuccessfully() {
      expect(mockedStub4).toHaveBeenCalled();
      expect(onSaved).toHaveBeenCalled();
    }
  };
}

async function clearInput(element) {
  await fireEvent.change(element, { target: { value: '' } });
}
