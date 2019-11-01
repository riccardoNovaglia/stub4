import React from 'react';

import ItemsList from '../../prototypes/ItemsList';

export function StubsList({ stubs, selected, setSelected }) {
  return (
    <ItemsList
      items={stubs}
      selected={selected}
      setSelected={setSelected}
      styles={{ itemClass: 'stub', listClass: 'stubsList' }}
      itemKey={item => `${item.urlMatcher.url}-item`}
      selectionMatch={(selected, current) => selected.urlMatcher.url === current.urlMatcher.url}
      itemComponent={StubListItem}
    />
  );
}

function StubListItem({ item }) {
  return (
    <p>
      <span className={`method ${item.method.toLowerCase()}`}>{item.method}</span>{' '}
      <span className="url">{item.urlMatcher.url}</span>
      <span>→</span>
      <span className="contentType">{item.response.response.contentType}</span>
    </p>
  );
}
