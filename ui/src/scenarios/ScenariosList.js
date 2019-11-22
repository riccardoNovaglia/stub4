import React from 'react';

import ItemsList from '../prototypes/ItemsList';

export function ScenariosList({ items, selected, setSelected }) {
  return (
    <ItemsList
      items={items}
      selected={selected}
      setSelected={setSelected}
      styles={{ itemClass: 'scenario', listClass: 'scenariosList' }}
      itemKey={item => `${item.urlMatcher.url}-item`}
      selectionMatch={(selected, current) => selected.urlMatcher.url === current.urlMatcher.url}
      itemComponent={ScenarioListItem}
    />
  );
}

function ScenarioListItem({ item }) {
  return (
    <p>
      <span className="url">{item.urlMatcher.url}</span>
      <span className="variableNames">{item.urlMatcher.variableNames}</span>
      <span>→</span>
      <span className="outcomesLength">
        {item.outcomes.length} outcome{item.outcomes.length > 1 ? 's' : ''}
      </span>
    </p>
  );
}
