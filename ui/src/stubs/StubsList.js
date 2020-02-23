import React from 'react';

import ItemsList from '../prototypes/ItemsList';

export function StubsList({ items, selected, setSelected }) {
  return (
    <ItemsList
      items={items}
      selected={selected}
      setSelected={setSelected}
      styles={{ itemClass: 'stub', listClass: 'stubsList' }}
      itemKey={item => `${item.requestMatcher.urlMatcher.url}-item`}
      selectionMatch={(selected, current) =>
        selected.requestMatcher.urlMatcher.url === current.requestMatcher.urlMatcher.url
      }
    >
      {{
        item: item => <StubListItem item={item} />
      }}
    </ItemsList>
  );
}

function StubListItem({ item }) {
  const methodClassName = method =>
    method === '*' || method === undefined ? 'any' : method.toLowerCase();

  return (
    <p>
      <span className={`method ${methodClassName(item.requestMatcher.method)}`}>
        {item.requestMatcher.method}
      </span>{' '}
      <span className="url">{item.requestMatcher.urlMatcher.url}</span>
      <span>→</span>
      <span className="contentType">{item.response.contentType}</span>
    </p>
  );
}
