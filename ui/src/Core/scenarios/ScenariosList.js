import React from 'react';

import ItemsList from '../prototypes/ItemsList';

export function ScenariosList({ items, selected, setSelected }) {
  return (
    <ItemsList
      items={items}
      selected={selected}
      setSelected={setSelected}
      styles={{ itemClass: 'scenario', listClass: 'scenariosList' }}
      itemKey={(item) => `${item.requestMatcher.urlMatcher.url}-item`}
      selectionMatch={(selected, current) =>
        selected.requestMatcher.urlMatcher.url === current.requestMatcher.urlMatcher.url
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
      <span className="url">{item.requestMatcher.urlMatcher.url}</span>
      <span className="variableNames">{item.requestMatcher.urlMatcher.variableNames}</span>
      <span>→</span>
      <span className="outcomesLength">
        {item.outcomes.length} outcome{item.outcomes.length > 1 ? 's' : ''}
      </span>
    </p>
  );
}
