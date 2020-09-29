import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InteractionsList } from './InteractionsList';

describe('all interactions list', () => {
  it('shows a placeholder if no interactions are provided', () => {
    render(<InteractionsList interactions={[]} />);
    expect(screen.getByText(/no interactions yet/i)).toBeInTheDocument();
  });

  it('shows the request url and method and X icon when a missed interaction is provided', async () => {
    render(<InteractionsList interactions={[unmatched({ url: '/something', method: 'GET' })]} />);
    expect(screen.getByText('GET /something')).toBeInTheDocument();
    expect(screen.getByText('close')).toBeInTheDocument();
  });

  it('shows the request method and url with the right icon when a matched interaction is provided', async () => {
    render(
      <InteractionsList
        interactions={[matched({ type: 'stub', requestMatcher: { url: '/stuff', method: 'GET' } })]}
      />
    );
    expect(screen.getByText('GET /stuff')).toBeInTheDocument();
    expect(screen.getByText('check')).toBeInTheDocument();
  });
});

describe('grouped', () => {
  it('shows a request multiplier when multiple of the same matched request are passed', async () => {
    render(
      <InteractionsList
        interactions={[
          matched({
            id: 'some-id',
            type: 'stub',
            requestMatcher: { url: '/stuff', method: 'GET' }
          }),
          matched({
            id: 'some-other-id',
            type: 'stub',
            requestMatcher: { url: '/things', method: 'GET' }
          }),
          matched({ id: 'some-id', type: 'stub', requestMatcher: { url: '/stuff', method: 'GET' } })
        ]}
      />
    );
    enableGroups();
    expect(screen.getByText('2x GET /stuff')).toBeInTheDocument();
    expect(screen.getByText('GET /things')).toBeInTheDocument();
  });

  it('shows a request multiplier when multiple of the same unmatched request are passed', async () => {
    render(
      <InteractionsList
        interactions={[
          unmatched({ url: '/something', method: 'GET' }),
          unmatched({ url: '/something', method: 'GET' })
        ]}
      />
    );
    enableGroups();
    expect(screen.getByText('2x GET /something')).toBeInTheDocument();
  });

  it('looks at all parts of an unmatched request to know whether to multiply', async () => {
    render(
      <InteractionsList
        interactions={[
          unmatched({ url: '/thing', method: 'GET', body: {}, headers: {} }),
          unmatched({ url: '/thang', method: 'GET', body: {}, headers: {} }),
          unmatched({ url: '/thing', method: 'GET', body: { some: 'value' }, headers: {} }),
          unmatched({ url: '/thing', method: 'GET', body: {}, headers: { some: 'header' } }),
          unmatched({ url: '/thing', method: 'POST', body: {}, headers: {} })
        ]}
      />
    );
    enableGroups();
    expect(screen.queryByText(/[\d]x/)).not.toBeInTheDocument(); // [any digit] + x (2x, 3x etc)
  });
});

function enableGroups() {
  userEvent.click(screen.getByText(/group/i));
}

function unmatched(requestDetails) {
  return { matched: false, requestDetails };
}

function matched(item) {
  return { matched: true, item };
}
