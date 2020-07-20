import React from 'react';

import ItemsList from '../prototypes/stubsComponents/ItemsList';

export function CrudsList({ items, selected, setSelected }) {
  return (
    <ItemsList
      items={items}
      selected={selected}
      setSelected={setSelected}
      styles={{ itemClass: 'crudDef', listClass: 'crudsList' }}
      itemKey={(item) => `${item.url}-item`}
      selectionMatch={(selected, current) => selected.url === current.url}
    >
      {{
        item: (item) => <CrudListItem item={item} />
      }}
    </ItemsList>
  );
}

function CrudListItem({ item }) {
  return (
    <p>
      <span className="url">{item.url}</span>
      <span>→</span>
      <span className="id">{item.idAlias}</span>
    </p>
  );
}
