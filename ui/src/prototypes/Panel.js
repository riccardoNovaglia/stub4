import React, { useState, useEffect } from 'react';

export function Panel({ itemsLifecycle, presentation, components, setStarter, client }) {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState();

  const { fetch, clear } = itemsLifecycle;
  const { label, icon, className } = presentation;
  const { list, edit } = components;

  useEffect(() => {
    fetch(setItems);
  }, [fetch, setItems]);

  return (
    <div className="panel">
      <h1>
        {label}
        <i className="material-icons">{icon}</i>
      </h1>
      <button className="clearBtn" onClick={clear}>
        <i className="material-icons">clear_all</i>Clear
      </button>
      <div className={className}>
        {list({ items, selected, setSelected })}
        {selected && edit({ selected, setStarter, client })}
      </div>
      <i className="material-icons resizer">height</i>
    </div>
  );
}
