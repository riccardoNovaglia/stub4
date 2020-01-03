import React from 'react';

import ItemsList from '../prototypes/ItemsList';

export function ProxyList({ items, selected, setSelected }) {
  return (
    <ItemsList
      items={items}
      selected={selected}
      setSelected={setSelected}
      styles={{ itemClass: 'proxyDef', listClass: 'proxyList' }}
      itemKey={item => `${item.request.url}-item`}
      selectionMatch={(selected, current) => selected.request.url === current.request.url}
    >
      {{
        item: item => <ProxyListItem item={item} />
      }}
    </ItemsList>
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
