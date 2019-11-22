import React from 'react';

import { Panel } from '../prototypes/Panel';
import { StubsList } from './StubsList';
import { SelectedStub } from './SelectedStub';
import { NewStub } from './NewStub';

import './Stub.scss';

export function Stubs({ client }) {
  const fetch = async set => {
    await client.fetchStubs(set);
  };

  const clear = async () => {
    await client.clearStubs();
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
      components={{ list: StubsList, preview: SelectedStub, create: NewStub }}
      client={client}
    />
  );
}
