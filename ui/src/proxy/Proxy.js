import React from 'react';

import { ProxyList } from './ProxyList';
import { NewProxy } from './NewProxy';
import { SelectedProxy } from './SelectedProxy';

import { Panel } from '../prototypes/Panel';

export function Proxy({ client }) {
  const fetch = set => {
    client.fetchProxy(set);
  };

  const clear = async () => {
    await client.clearProxy();
  };

  const save = async proxy => {
    await client.proxyRequests(proxy.url.value, proxy.proxyUrl.value);
  };

  return (
    <Panel
      itemsLifecycle={{ fetch, clear, save }}
      presentation={{ label: 'Proxy', icon: 'redo', className: 'proxyBody' }}
      client={client}
    >
      {{
        preview: (selected, onEdit) => (
          <SelectedProxy client={client} selected={selected} onEdit={onEdit} />
        ),
        list: (items, selected, setSelected) => (
          <ProxyList items={items} selected={selected} setSelected={setSelected} />
        ),
        create: (onClose, setNewItem, edited) => (
          <NewProxy onClose={onClose} setNewItem={setNewItem} edited={edited} />
        )
      }}
    </Panel>
  );
}
