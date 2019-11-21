import React from 'react';

import { Panel } from '../prototypes/Panel';
import { StubsList } from './StubsList';
import { SelectedStub } from './SelectedStub';
import { NewStub } from './NewStub';

import './Stub.scss';

export function Stubs({ onClear, setStarter, client }) {
  const fetch = set => {
    client.fetchStubs(set);
  };

  const clear = async () => {
    await client.clearStubs();
    onClear();
  };

  const save = async stub => {
    await client.stub(
      client
        .request(stub.method.value, stub.url.value)
        .returns(stub.type.value, stub.body.value, stub.status.value)
    );
  };

  return (
    <Panel
      itemsLifecycle={{ fetch, clear, save }}
      presentation={{ label: 'Stubs', icon: 'import_export', className: 'stubs' }}
      components={{ list: StubsList, edit: SelectedStub, create: NewStub }}
      setStarter={setStarter}
      client={client}
    />
  );
}
