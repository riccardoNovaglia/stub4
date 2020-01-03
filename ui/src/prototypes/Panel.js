import React, { useState, useEffect } from 'react';

import { NewItemModal } from './NewItemModal';

export function Panel({ itemsLifecycle, presentation, client, children }) {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState();

  const [edited, setEdited] = useState();

  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);

  const { fetch, clear, save } = itemsLifecycle;
  const { label, icon, className } = presentation;

  useEffect(() => {
    fetch(setItems);
  }, [fetch, setItems]);

  const onEdit = item => {
    setEdited(item);
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

  const onClear = async () => {
    await clear();
    await fetch(setItems);
  };

  const createNew = () => {
    setEdited(null);
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
        {selected && children.preview(selected, client, onEdit)}
        {(creating || editing) && (
          <NewItemModal onClose={onClose} save={onSave} edited={edited}>
            {{
              create: (onClose, setNewItem) => children.create(onClose, setNewItem, edited)
            }}
          </NewItemModal>
        )}
      </div>
      <i className="material-icons resizer">height</i>
    </div>
  );
}
