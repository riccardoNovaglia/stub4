import React from 'react';

import { CrudsList } from './CrudsList';
import { SelectedCrud } from './SelectedCrud';

import { Panel } from '../prototypes/Panel';

export function Cruds({ onClear, client }) {
  const setStarter = () => {};

  const fetch = set => {
    client.fetchCruds(set);
  };

  const clear = async () => {
    await client.clearCruds();
    onClear();
  };

  return (
    <Panel
      itemsLifecycle={{ fetch, clear }}
      presentation={{ label: 'Cruds', icon: 'swap_horiz', className: 'cruds' }}
      components={{ list: CrudsList, preview: SelectedCrud }}
      setStarter={setStarter}
      client={client}
    />
  );
}
