import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { when, resetAllWhenMocks } from 'jest-when';

import { stubFor as mockedStub4 } from '@stub4/client';
import { CrudEditor } from './CrudEditor';

const onClose = jest.fn();
const onSaved = jest.fn();
const noEditedItem = undefined;

jest.mock('@stub4/client', () => ({ stubFor: jest.fn(), cruds: { setEnabled: jest.fn() } }));
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
      id: undefined,
      requestMatcher: { url: '' },
      crud: {
        idAlias: '',
        patchOnPost: false,
        items: []
      }
    })
    .mockResolvedValue();
  const { theCrudWasSavedSuccessfully } = renderNewCrud();

  userEvent.click(screen.getByText('Save'));

  await waitFor(() => expect(theCrudWasSavedSuccessfully()));
});

it('allows changing values and calls crud4 correspondingly', async () => {
  when(mockedStub4)
    .expectCalledWith({
      id: undefined,
      requestMatcher: {
        url: '/some-url'
      },
      crud: {
        idAlias: 'a-new-id',
        patchOnPost: true,
        items: []
      }
    })
    .mockResolvedValue();
  const { theCrudWasSavedSuccessfully } = renderNewCrud();

  userEvent.type(screen.getByLabelText('URL'), 'some-url');
  userEvent.type(screen.getByLabelText('ID ALIAS'), 'a-new-id');
  userEvent.click(screen.getByLabelText('PATCH ON POST'));

  userEvent.click(screen.getByText('Save'));

  await waitFor(() => expect(theCrudWasSavedSuccessfully()));
});

it('picks values from an edited crud overwriting the defaults', async () => {
  when(mockedStub4)
    .expectCalledWith({
      id: 'some-id',
      requestMatcher: {
        url: '/some-random-url'
      },
      crud: {
        idAlias: 'some-alias',
        patchOnPost: false,
        items: [{ an: 'item' }]
      }
    })
    .mockResolvedValue();
  const { theCrudWasSavedSuccessfully } = renderNewCrud({
    id: 'some-id',
    requestMatcher: { url: '/some-random-url' },
    crud: { idAlias: 'some-alias', patchOnPost: false, items: [{ an: 'item' }] }
  });

  userEvent.click(screen.getByText('Save'));

  await waitFor(() => expect(theCrudWasSavedSuccessfully()));
});

it('sets the value from the edited crud in the form', async () => {
  renderNewCrud({
    requestMatcher: { url: '/some-random-url' },
    crud: { idAlias: 'some-stuff-id', patchOnPost: true }
  });

  expect(screen.getByLabelText('URL').value).toEqual('/some-random-url');
  expect(screen.getByLabelText('ID ALIAS').value).toEqual('some-stuff-id');
  expect(screen.getByLabelText('PATCH ON POST').checked).toEqual(true);
});

function renderNewCrud(editedItem = noEditedItem) {
  const container = render(
    <CrudEditor onClose={onClose} onSaved={onSaved} editedItem={editedItem} />
  );
  return {
    ...container,
    theCrudWasSavedSuccessfully() {
      expect(mockedStub4).toHaveBeenCalled();
      expect(onSaved).toHaveBeenCalled();
    }
  };
}
