import React from 'react';

import ItemsList from '../prototypes/ItemsList';

export function ProxyList({ items, selected, setSelected }) {
  return (
    <ItemsList
      items={items}
      selected={selected}
      setSelected={setSelected}
      styles={{ itemClass: 'proxyDef', listClass: 'proxyList' }}
      itemKey={(item) => `${item.requestMatcher.urlMatcher.url}-item`}
      selectionMatch={(selected, current) =>
        selected.requestMatcher.urlMatcher.url === current.requestMatcher.urlMatcher.url
      }
    >
      {{
        item: (item) => <ProxyListItem item={item} />
      }}
    </ItemsList>
  );
}

function ProxyListItem({ item }) {
  return (
    <p>
      <span className="url">{item.requestMatcher.urlMatcher.url}</span>
      <span>→</span>
      <span className="proxyUrl">{item.proxyUrl}</span>
    </p>
  );
}
