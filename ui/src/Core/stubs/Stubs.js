import React from 'react';
import { Route, useHistory } from 'react-router-dom';

import { Panel } from '../prototypes/stubsComponents/Panel';
import { StubsList } from './StubsList';
import { EditStub, NewStub } from './Stub';
import './Stub.scss';

export function Stubs({ client }) {
  const history = useHistory();
  // TODO: last place to remove the client!
  const fetch = async (set) => await client.fetchStubs(set);
  const clear = async () => await client.clearStubs();

  const onSelect = (item) => history.push(`/stub4/stubs/edit/${item.id}`);

  return (
    <>
      <Route path="/stub4/stubs/edit/:id">
        <EditStub />
      </Route>
      <Route path="/stub4/stubs/new">
        <NewStub />
      </Route>
      <Route>
        <Panel
          itemsLifecycle={{ fetch, clear }}
          presentation={{ label: 'Stubs', icon: 'import_export', className: 'stubs' }}
          pathBased={true}
        >
          {{
            list: (items, _) => <StubsList items={items} selected={null} setSelected={onSelect} />,
            preview: (_) => <></>,
            create: (_) => <></>
          }}
        </Panel>
      </Route>
    </>
  );
}
