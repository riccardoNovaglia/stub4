import React from 'react';

import { CrudsList } from './CrudsList';
import { SelectedCrud } from './SelectedCrud';
import { NewCrud } from './NewCrud';

import { Panel } from '../prototypes/Panel';

export function Cruds({ client }) {
  const fetch = (set) => client.fetchCruds(set);
  const clear = async () => await client.clearCruds();

  return (
    <Panel
      itemsLifecycle={{ fetch, clear }}
      presentation={{ label: 'Cruds', icon: 'swap_horiz', className: 'cruds' }}
      client={client}
    >
      {{
        preview: (selected, onEdit) => <SelectedCrud client={client} selected={selected} />,
        list: (items, selected, setSelected) => (
          <CrudsList items={items} selected={selected} setSelected={setSelected} />
        ),
        create: (onClose, onSaved, editedItem) => (
          <NewCrud client={client} onClose={onClose} onSaved={onSaved} editedItem={editedItem} />
        )
      }}
    </Panel>
  );
}
