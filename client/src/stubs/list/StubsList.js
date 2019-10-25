import React from 'react';

import ItemsList from '../../prototypes/ItemsList';

export function StubsList({ stubs, selected, setSelected }) {
  return (
    <ItemsList
      items={stubs}
      selected={selected}
      setSelected={setSelected}
      styles={{ itemClass: 'stub', listClass: 'stubsList' }}
      itemKey={item => `${item.request.url}-item`}
      selectionMatch={(selected, current) => selected.request.url === current.request.url}
      itemComponent={StubListItem}
    />
  );
}

function StubListItem({ item }) {
  return (
    <p>
      <span className={`method ${item.request.method.toLowerCase()}`}>{item.request.method}</span>{' '}
      <span className="url">{item.request.url}</span>
      <span>→</span>
      <span className="contentType">{item.response.contentType}</span>
    </p>
  );
}
