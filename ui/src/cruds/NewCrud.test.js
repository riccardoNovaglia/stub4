import React from 'react';
import { render, screen, wait } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { when, resetAllWhenMocks } from 'jest-when';

import { stubFor as mockedStub4 } from '@stub4/client';
import { NewCrud } from './NewCrud';

const onClose = jest.fn();
const onSaved = jest.fn();
const noEditedItem = undefined;

jest.mock('@stub4/client', () => ({ stubFor: jest.fn() }));
beforeEach(() => {
  jest.resetAllMocks();
  resetAllWhenMocks();
});

it('renders with a few default values', async () => {
  renderNewCrud();

  expect(screen.getByLabelText('URL').value).toEqual('');
  expect(screen.getByLabelText('ID ALIAS').value).toEqual('');
});

it('calls crud4 with the right parameters given the default values', async () => {
  when(mockedStub4)
    .expectCalledWith({
      requestMatcher: { url: '' },
      crud: {
        idAlias: '',
        patchOnPost: false
      }
    })
    .mockResolvedValue();
  const { theCrudWasSavedSuccessfully } = renderNewCrud();

  userEvent.click(screen.getByText('Save'));

  await wait(() => expect(theCrudWasSavedSuccessfully()));
});

it('allows changing values and calls crud4 correspondingly', async () => {
  when(mockedStub4)
    .expectCalledWith({
      requestMatcher: {
        url: '/some-url'
      },
      crud: {
        idAlias: 'a-new-id',
        patchOnPost: false
      }
    })
    .mockResolvedValue();
  const { theCrudWasSavedSuccessfully } = renderNewCrud();

  userEvent.type(screen.getByLabelText('URL'), 'some-url');
  userEvent.type(screen.getByLabelText('ID ALIAS'), 'a-new-id');

  userEvent.click(screen.getByText('Save'));

  await wait(() => expect(theCrudWasSavedSuccessfully()));
});

it('picks values from an edited crud overwriting the defaults', async () => {
  when(mockedStub4)
    .expectCalledWith({
      requestMatcher: {
        url: '/some-random-url'
      },
      crud: {
        idAlias: 'some-alias',
        patchOnPost: false
      }
    })
    .mockResolvedValue();
  const { theCrudWasSavedSuccessfully } = renderNewCrud({
    requestMatcher: { url: '/some-random-url' },
    crud: { idAlias: 'some-alias' }
  });

  userEvent.click(screen.getByText('Save'));

  await wait(() => expect(theCrudWasSavedSuccessfully()));
});

it('sets the value from the edited crud in the form', async () => {
  renderNewCrud({
    requestMatcher: { url: '/some-random-url' },
    crud: { idAlias: 'some-stuff-id' }
  });

  expect(screen.getByLabelText('URL').value).toEqual('/some-random-url');
  expect(screen.getByLabelText('ID ALIAS').value).toEqual('some-stuff-id');
});

function renderNewCrud(editedItem = noEditedItem) {
  const container = render(<NewCrud onClose={onClose} onSaved={onSaved} editedItem={editedItem} />);
  return {
    ...container,
    theCrudWasSavedSuccessfully() {
      expect(mockedStub4).toHaveBeenCalled();
      expect(onSaved).toHaveBeenCalled();
    }
  };
}
