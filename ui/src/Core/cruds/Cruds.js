import React from 'react';
import { Route, useHistory } from 'react-router-dom';

import { Panel } from '../prototypes/stubsComponents/Panel';
import { CrudsList } from './CrudsList';
import { EditCrud, NewCrud } from './Crud';
// import './Crud.scss'; // TODO: mmh, is this better? Probably right?

export function Cruds({ client }) {
  const history = useHistory();
  // TODO: last place to remove the client!
  const fetch = async (set) => await client.fetchCruds(set);
  const clear = async () => await client.clearCruds();

  const onSelect = (item) => history.push(`/stub4/cruds/edit/${item.id}`);

  return (
    <>
      <Route path="/stub4/cruds/edit/:id">
        <EditCrud />
      </Route>
      <Route path="/stub4/cruds/new">
        <NewCrud />
      </Route>
      <Route>
        <Panel
          itemsLifecycle={{ fetch, clear }}
          presentation={{ label: 'Cruds', icon: 'import_export', className: 'cruds' }}
          pathBased={true}
        >
          {{
            list: (items, _) => <CrudsList items={items} selected={null} setSelected={onSelect} />,
            preview: (_) => <></>,
            create: (_) => <></>
          }}
        </Panel>
      </Route>
    </>
  );
}
