import ItemsList from '../prototypes/stubsComponents/ItemsList';

export function StubsList({ items, selected, setSelected }) {
  return (
    <ItemsList
      items={items}
      selected={selected}
      setSelected={setSelected}
      styles={{ itemClass: 'stub', listClass: 'stubsList' }}
      itemKey={(item) => `${item.requestMatcher.url}-item`}
      selectionMatch={(selected, current) =>
        selected.requestMatcher.url === current.requestMatcher.url
      }
    >
      {{
        item: (item) => <StubListItem item={item} />
      }}
    </ItemsList>
  );
}

function StubListItem({ item }) {
  const methodClassName = (method) =>
    method === '*' || method === undefined ? 'any' : method.toLowerCase();

  return (
    <p>
      <span className={`method ${methodClassName(item.requestMatcher.method)}`}>
        {item.requestMatcher.method}
      </span>{' '}
      <span className="url">{item.requestMatcher.url}</span>
      <span>→</span>
      <span className="contentType">{item.response.contentType}</span>
    </p>
  );
}
