import React from 'react';

import { Panel } from '../prototypes/stubsComponents/Panel';
import { StubsList } from './StubsList';
import { SelectedStub } from './SelectedStub';
import { NewStub } from './NewStub';

import './Stub.scss';

export function Stubs({ client }) {
  const fetch = async (set) => await client.fetchStubs(set);
  const clear = async () => await client.clearStubs();

  return (
    <Panel
      itemsLifecycle={{ fetch, clear }}
      presentation={{ label: 'Stubs', icon: 'import_export', className: 'stubs' }}
    >
      {{
        preview: (selected, onEdit) => (
          <SelectedStub client={client} selected={selected} onEdit={onEdit} />
        ),
        list: (items, selected, setSelected) => (
          <StubsList items={items} selected={selected} setSelected={setSelected} />
        ),
        create: (onClose, onSaved, editedItem) => (
          <NewStub client={client} onClose={onClose} onSaved={onSaved} editedItem={editedItem} />
        )
      }}
    </Panel>
  );
}
