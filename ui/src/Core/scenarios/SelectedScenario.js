import React from 'react';
import { omit } from 'lodash';

import './Scenarios.scss';

export function SelectedScenario({ selected, setStarter }) {
  return (
    <>
      <div className="selectedScenario">
        <div className="url">{selected.requestMatcher.urlMatcher.url}</div>
        {selected.outcomes.map((outcome) => (
          <div>
            <span className="variableNames">{JSON.stringify(omit(outcome, 'response'))}</span>
            <span>→</span>
            <span className="responseBody">{JSON.stringify(outcome.response)}</span>
          </div>
        ))}
        <p>Default</p>
        <p>{JSON.stringify(selected.defaultResponse)}</p>
      </div>
    </>
  );
}
