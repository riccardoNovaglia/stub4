import React from 'react';

import ItemsList from '../../prototypes/ItemsList';

export function CrudsList({ cruds, selected, setSelected }) {
  return (
    <ItemsList
      items={cruds}
      selected={selected}
      setSelected={setSelected}
      styles={{ itemClass: 'crudDef', listClass: 'crudsList' }}
      itemKey={item => `${item.url}-item`}
      selectionMatch={(selected, current) => selected.url === current.url}
      itemComponent={CrudListItem}
    />
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
