import React, { useState, useEffect } from 'react';

import { NewItemModal } from './NewItemModal';

export function Panel({ itemsLifecycle, presentation, children }) {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState();

  const [editedItem, setEditedItem] = useState();

  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);

  const { fetch, clear } = itemsLifecycle;
  const { label, icon, className } = presentation;

  useEffect(() => {
    fetch(setItems);
  }, [fetch, setItems]);

  const onEdit = item => {
    setEditedItem(item);
    setEditing(true);
  };

  const onClose = () => {
    setCreating(false);
    setEditing(false);
  };

  const onSaved = async () => {
    await fetch(setItems);
    setCreating(false);
    setEditing(false);
    setSelected(null);
  };

  const onClear = async () => {
    await clear();
    await fetch(setItems);
  };

  const createNew = () => {
    setEditedItem(null);
    setCreating(true);
  };

  return (
    <div className="panel">
      <h1>
        {label}
        <i className="material-icons">{icon}</i>
        <button className="createBtn" onClick={createNew}>
          <i className="material-icons">add_box</i>Create
        </button>
        <button className="clearBtn" onClick={onClear}>
          <i className="material-icons">clear_all</i>Clear
        </button>
      </h1>
      <div className={className}>
        {children.list(items, selected, setSelected)}
        {selected && children.preview(selected, onEdit)}
        {(creating || editing) && (
          <NewItemModal itemName={label} onClose={onClose}>
            {{
              create: () => children.create(onClose, onSaved, editedItem)
            }}
          </NewItemModal>
        )}
      </div>
      <i className="material-icons resizer">height</i>
    </div>
  );
}
