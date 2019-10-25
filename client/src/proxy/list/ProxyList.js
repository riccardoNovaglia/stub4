import React from 'react';

import ItemsList from '../../prototypes/ItemsList';

export function ProxyList({ proxy, selected, setSelected }) {
  return (
    <ItemsList
      items={proxy}
      selected={selected}
      setSelected={setSelected}
      styles={{ itemClass: 'proxyDef', listClass: 'proxyList' }}
      itemKey={item => `${item.request.url}-item`}
      selectionMatch={(selected, current) => selected.request.url === current.request.url}
      itemComponent={ProxyListItem}
    />
  );
}

function ProxyListItem({ item }) {
  return (
    <p>
      <span className="url">{item.request.url}</span>
      <span>→</span>
      <span className="proxyUrl">{item.proxyUrl}</span>
    </p>
  );
}
