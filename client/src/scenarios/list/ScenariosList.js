import _ from 'lodash';
import React from 'react';

export function ScenariosList({ scenarios, selected, setSelected }) {
  return (
    <div className="scenariosList">
      {_.isEmpty(scenarios) && <p className="noResultsMsg">No scenarios have been created yet</p>}
      {scenarios.map(scenario => (
        <div
          className={
            selected && selected.urlMatcher.url === scenario.urlMatcher.url
              ? 'scenario selected'
              : 'scenario'
          }
          onClick={() => setSelected(scenario)}
        >
          <span className="url">{scenario.urlMatcher.url}</span>
          <span className="variableNames">{scenario.urlMatcher.variableNames}</span>
          <span>→</span>
          <span className="outcomesLength">
            {scenario.outcomes.length} outcome{scenario.outcomes.length > 1 ? 's' : ''}
          </span>
        </div>
      ))}
    </div>
  );
}
