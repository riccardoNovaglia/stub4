import React, { useState } from 'react';

import { ScenariosList } from './list/ScenariosList';
import { SelectedScenario } from './selected/SelectedScenario';
import Stub4 from '@Stub4/client';

import './Scenarios.scss';

const scenarioClient = new Stub4.ScenariosClient();

export function Scenarios({ scenarios, onClear, setStarter }) {
  const [selected, setSelected] = useState();

  const clear = async () => {
    await scenarioClient.clearScenarios();
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
