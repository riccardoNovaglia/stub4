import React, { useState } from 'react';

import Tabs from '../navigation/Tabs';
import { NewItemModal } from '../prototypes/NewItemModal';
import { NewStub } from '../stubs/NewStub';
import { NewCrud } from '../cruds/NewCrud';
import { NewProxy } from '../proxy/NewProxy';

export function UnmatchedToItem({ clients, selected, setSelected, setTab }) {
  const [tab, setCurrentTab] = useState('stubs');

  const onClose = () => {
    setSelected(null);
  };

  const onSaved = () => {
    setSelected(null);
    setTab(tab);
  };

  if (!selected) return null;

  return (
    <div onKeyDown={(e) => e.keyCode === 27 && onClose()}>
      <NewItemModal itemName={tab} onClose={onClose}>
        <>
          <Tabs tab={tab} setCurrentTab={setCurrentTab} />
          {tab === 'stubs' && (
            <NewStub
              client={clients.stubClient}
              onClose={onClose}
              onSaved={onSaved}
              editedItem={{ urlMatcher: { url: selected.url }, method: selected.method }}
            />
          )}
          {tab === 'scenarios' && <p>Sorry, this is not supported yet</p>}
          {tab === 'cruds' && (
            <NewCrud
              client={clients.crudClient}
              onClose={onClose}
              onSaved={onSaved}
              editedItem={selected}
            />
          )}
          {tab === 'proxy' && (
            <NewProxy
              client={clients.proxyClient}
              onClose={onClose}
              onSaved={onSaved}
              editedItem={{ request: { url: selected.url }, method: selected.method }}
            />
          )}
        </>
      </NewItemModal>
    </div>
  );
}
