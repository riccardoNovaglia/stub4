import React from 'react';
import { Route, useHistory } from 'react-router-dom';

import { Panel } from '../prototypes/stubsComponents/Panel';
import { ScenariosList } from './ScenariosList';
import { EditScenario, NewScenario } from './Scenario';
import './Scenarios.scss';

export function Scenarios({ client }) {
  const history = useHistory();
  // TODO: last place to remove the client!
  const fetch = async (set) => await client.fetchScenarios(set);
  const clear = async () => await client.clearScenarios();

  const onSelect = (item) => history.push(`/stub4/scenarios/edit/${item.id}`);

  return (
    <>
      <Route path="/stub4/scenarios/edit/:id">
        <EditScenario />
      </Route>
      <Route path="/stub4/scenarios/new">
        <NewScenario />
      </Route>
      <Route>
        <Panel
          itemsLifecycle={{ fetch, clear }}
          presentation={{ label: 'Scenarios', icon: 'import_export', className: 'scenarios' }}
          pathBased={true}
        >
          {{
            list: (items, _) => (
              <ScenariosList items={items} selected={null} setSelected={onSelect} />
            ),
            preview: (_) => <></>,
            create: (_) => <></>
          }}
        </Panel>
      </Route>
    </>
  );
}
