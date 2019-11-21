import React from 'react';

import { ProxyList } from './list/ProxyList';
import { SelectedProxy } from './selected/SelectedProxy';

import { Panel } from '../prototypes/Panel';

export function Proxy({ onClear, setStarter, client }) {
  const fetch = set => {
    client.fetchProxy(set);
  };

  const clear = async () => {
    await client.clearProxy();
    onClear();
  };

  return (
    <Panel
      itemsLifecycle={{ fetch, clear }}
      presentation={{ label: 'Proxy', icon: 'redo', className: 'proxyBody' }}
      components={{ list: ProxyList, preview: SelectedProxy }}
      setStarter={setStarter}
      client={client}
    />
  );
}
