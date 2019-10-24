import React, { useState, useEffect } from 'react';

import { ScenariosList } from './list/ScenariosList';
import { SelectedScenario } from './selected/SelectedScenario';

import './Scenarios.scss';

export function Scenarios({ onClear, setStarter, client }) {
  const [selected, setSelected] = useState();
  const [scenarios, setScenarios] = useState([]);
  useEffect(() => {
    client.fetchScenarios(setScenarios);
  }, [setScenarios, client]);

  const clear = async () => {
    await client.clearScenarios();
    onClear();
  };

  return (
    <div className="panel">
      <h1>
        Scenarios<i className="material-icons">import_export</i>
      </h1>
      <button className="clearBtn" onClick={clear}>
        <i className="material-icons">clear_all</i>Clear
      </button>
      <div className="scenarios">
        <ScenariosList scenarios={scenarios} selected={selected} setSelected={setSelected} />
        {selected && <SelectedScenario selectedScenario={selected} setStarter={setStarter} />}
      </div>
      <i className="material-icons resizer">height</i>
    </div>
  );
}
