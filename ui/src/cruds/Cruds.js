import React from 'react';

import { CrudsList } from './CrudsList';
import { SelectedCrud } from './SelectedCrud';
import { NewCrud } from './NewCrud';

import { Panel } from '../prototypes/Panel';

export function Cruds({ client }) {
  const fetch = set => {
    client.fetchCruds(set);
  };

  const clear = async () => {
    await client.clearCruds();
  };

  const save = async crud => {
    await client.createCrud(crud.url.value, crud.idAlias.value);
  };

  return (
    <Panel
      itemsLifecycle={{ fetch, clear, save }}
      presentation={{ label: 'Cruds', icon: 'swap_horiz', className: 'cruds' }}
      components={{ list: CrudsList, preview: SelectedCrud, create: NewCrud }}
      client={client}
    />
  );
}
