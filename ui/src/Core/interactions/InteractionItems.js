import React from 'react';
import { useHistory } from 'react-router-dom';

export function Matched({ item, count }) {
  const { id, requestMatcher, type } = item;
  const history = useHistory();
  const destination = `/stub4/${type.toLowerCase()}/edit/${id}`;
  return (
    <a
      className="interactionLink"
      href={destination}
      onClick={(e) => {
        e.preventDefault();
        history.push(destination);
      }}
    >
      {/* TODO: different icons per type */}
      <i className="material-icons md-36 green">check</i>
      {count > 1 && `${count}x `}
      {requestMatcher.method} {requestMatcher.url}
    </a>
  );
}

export function Unmatched({ requestDetails, count }) {
  const { url, method, headers, body } = requestDetails;
  const history = useHistory();
  const destination = '/stub4/stubs/new';
  return (
    <a
      className="interactionLink"
      href={destination}
      onClick={(e) => {
        e.preventDefault();
        history.push(destination);
      }}
    >
      <i className="material-icons md-36 red">close</i>
      {count > 1 && `${count}x `}
      {method} {url} {JSON.stringify(headers)} {JSON.stringify(body)}
    </a>
  );
}
