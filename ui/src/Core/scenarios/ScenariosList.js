import React from 'react';

import ItemsList from '../prototypes/stubsComponents/ItemsList';

export function ScenariosList({ items, selected, setSelected }) {
  return (
    <ItemsList
      items={items}
      selected={selected}
      setSelected={setSelected}
      styles={{ itemClass: 'scenario', listClass: 'scenariosList' }}
      itemKey={(item) => `${item.requestMatcher.url}-item`}
      selectionMatch={(selected, current) =>
        selected.requestMatcher.url === current.requestMatcher.url
      }
    >
      {{
        item: (item) => <ScenarioListItem item={item} />
      }}
    </ItemsList>
  );
}

function ScenarioListItem({ item }) {
  return (
    <p>
      <span className="url">{item.requestMatcher.url}</span>
      <span className="variableNames">{item.requestMatcher?.urlMatcher?.variableNames}</span>
      <span>→</span>
      <span className="outcomesLength">
        {item.scenarios.outcomes.length} outcome{item.scenarios.outcomes.length > 1 ? 's' : ''}
      </span>
    </p>
  );
}
