import React, { useState, useEffect } from 'react';

import { NewItemModal } from './NewItemModal';

export function Panel({ itemsLifecycle, presentation, components, setStarter, client }) {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState();

  const [something, setSomething] = useState();
  const [creating, setCreating] = useState();
  const [editing, setEditing] = useState();

  const { fetch, clear, save } = itemsLifecycle;
  const { label, icon, className } = presentation;
  const { list, preview, create } = components;

  useEffect(() => {
    fetch(setItems);
  }, [fetch, setItems]);

  const onEdit = item => {
    setSomething(item);
    setEditing(true);
  };

  const onClose = () => {
    setCreating(false);
    setEditing(false);
  };

  const onSave = async item => {
    await save(item);
    await fetch(setItems);
    setCreating(false);
    setEditing(false);
    setSelected(null);
  };

  return (
    <div className="panel">
      <h1>
        {label}
        <i className="material-icons">{icon}</i>
        <button className="createBtn" onClick={() => setCreating(true)}>
          <i className="material-icons">add_box</i>Create
        </button>
        <button className="clearBtn" onClick={clear}>
          <i className="material-icons">clear_all</i>Clear
        </button>
      </h1>
      <div className={className}>
        {list({ items, selected, setSelected })}
        {selected && preview({ selected, setStarter, client, onEdit })}
        {(creating || editing) && (
          <NewItemModal onClose={onClose} create={create} save={onSave} selected={something} />
        )}
      </div>
      <i className="material-icons resizer">height</i>
    </div>
  );
}
