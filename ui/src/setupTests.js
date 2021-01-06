import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

export function renderWithRouter(
  ui,
  { route = '/', history = createMemoryHistory({ initialEntries: [route] }) } = {}
) {
  const Wrapper = ({ children }) => <Router history={history}>{children}</Router>;
  return {
    ...render(ui, { wrapper: Wrapper }),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history
  };
}

beforeAll(() => {
  navigator.clipboard = {
    writeText: jest.fn()
  };
});
