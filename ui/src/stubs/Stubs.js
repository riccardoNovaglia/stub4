import React from 'react';

import { StubsList } from './list/StubsList';
import { SelectedStub } from './selected/SelectedStub';

import { Panel } from '../prototypes/Panel';

import './Stub.scss';

export function Stubs({ onClear, setStarter, client }) {
  const fetch = set => {
    client.fetchStubs(set);
  };

  const clear = async () => {
    await client.clearStubs();
    onClear();
  };

  return (
    <Panel
      itemsLifecycle={{ fetch, clear }}
      presentation={{ label: 'Stubs', icon: 'import_export', className: 'stubs' }}
      components={{ list: StubsList, edit: SelectedStub }}
      setStarter={setStarter}
      client={client}
    />
  );
}
