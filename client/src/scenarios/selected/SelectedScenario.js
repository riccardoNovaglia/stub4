import React from 'react';
import { omit } from 'lodash';

import './SelectedScenario.scss';

export function SelectedScenario({ selectedScenario, setStarter }) {
  return (
    <>
      <div className="selectedScenario">
        <div className="url">{selectedScenario.urlMatcher.url}</div>
        {selectedScenario.outcomes.map(outcome => (
          <div>
            <span className="variableNames">{JSON.stringify(omit(outcome, 'response'))}</span>
            <span>→</span>
            <span className="responseBody">{JSON.stringify(outcome.response)}</span>
          </div>
        ))}
        <p>Default</p>
        <p>{JSON.stringify(selectedScenario.defaultResponse.response)}</p>
      </div>
    </>
  );
}
