import React from 'react';

import { ScenariosList } from './list/ScenariosList';
import { SelectedScenario } from './selected/SelectedScenario';

import { Panel } from '../prototypes/Panel';

import './Scenarios.scss';

export function Scenarios({ onClear, setStarter, client }) {
  const fetch = set => {
    client.fetchScenarios(set);
  };

  const clear = async () => {
    await client.clearScenarios();
    onClear();
  };

  return (
    <Panel
      itemsLifecycle={{ fetch, clear }}
      presentation={{ label: 'Scenarios', icon: 'import_export', className: 'scenarios' }}
      components={{ list: ScenariosList, preview: SelectedScenario }}
      setStarter={setStarter}
      client={client}
    />
  );
}
