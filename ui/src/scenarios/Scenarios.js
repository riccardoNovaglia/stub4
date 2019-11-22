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
      components={{ list: ScenariosList, preview: SelectedScenario, create: NewScenario }}
      client={client}
    />
  );
}

function NewScenario() {
  return <p>Not yet!</p>;
}
