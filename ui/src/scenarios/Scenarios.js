import React from 'react';

import { ScenariosList } from './ScenariosList';
import { SelectedScenario } from './SelectedScenario';

import { Panel } from '../prototypes/Panel';

import './Scenarios.scss';

export function Scenarios({ client }) {
  const fetch = set => {
    client.fetchScenarios(set);
  };

  const clear = async () => {
    await client.clearScenarios();
  };

  const save = async scenario => {
    console.log('TODO!', scenario);
  };

  return (
    <Panel
      itemsLifecycle={{ fetch, clear, save }}
      presentation={{ label: 'Scenarios', icon: 'import_export', className: 'scenarios' }}
      client={client}
    >
      {{
        preview: selected => <SelectedScenario selected={selected} client={client} />,
        list: (items, selected, setSelected) => (
          <ScenariosList items={items} selected={selected} setSelected={setSelected} />
        ),
        create: (onClose, setNewItem, edited) => (
          <NewScenario onClose={onClose} setNewItem={setNewItem} edited={edited} />
        )
      }}
    </Panel>
  );
}

function NewScenario() {
  return <p>Not yet!</p>;
}
