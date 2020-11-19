import ItemsList from '../prototypes/stubsComponents/ItemsList';

export function ProxyList({ items, selected, setSelected }) {
  return (
    <ItemsList
      items={items}
      selected={selected}
      setSelected={setSelected}
      styles={{ itemClass: 'proxyDef', listClass: 'proxyList' }}
      itemKey={(item) => `${item.requestMatcher.url}-item`}
      selectionMatch={(selected, current) =>
        selected.requestMatcher.url === current.requestMatcher.url
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
      <span className="url">{item.requestMatcher.url}</span>
      <span>→ </span>
      <span className="proxyUrl">{item.proxy.destinationUrl}</span>
    </p>
  );
}
