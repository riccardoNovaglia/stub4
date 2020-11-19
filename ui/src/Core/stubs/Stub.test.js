import { Route } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import { renderWithRouter } from '../../setupTests';
import { EditStub } from './Stub';
import { stubs as mockedStubs } from '@stub4/client';

jest.mock('./StubEditor', () => ({
  StubEditor: jest.fn(({ editedItem }) => <p>{JSON.stringify(editedItem)}</p>)
}));
jest.mock('@stub4/client', () => ({
  stubs: {
    getById: jest.fn()
  }
}));

it('renders the stub editor after fetching the stub by id', async () => {
  const someStub = { some: 'stub' };
  mockedStubs.getById.mockResolvedValue(someStub);
  renderStub({ route: '/someId' });
  await waitFor(() => expect(screen.getByText(`${JSON.stringify(someStub)}`)).toBeInTheDocument());
  expect(mockedStubs.getById).toHaveBeenCalledWith('someId');
});

it('renders a message while the stub loads', async () => {
  renderStub({ route: '/someId' });
  await waitFor(() => expect(screen.getByText(`Just a second...`)).toBeInTheDocument());
});

it("renders an error message if the mock couldn't be found", async () => {
  mockedStubs.getById.mockRejectedValue('stub not found');
  renderStub({ route: '/someId' });
  await waitFor(() =>
    expect(screen.getByText(`Stub not found with id 'someId'`)).toBeInTheDocument()
  );
});

function renderStub({ route = '/someId' }) {
  renderWithRouter(
    <Route path="/:id">
      <EditStub />
    </Route>,
    { route }
  );
}
