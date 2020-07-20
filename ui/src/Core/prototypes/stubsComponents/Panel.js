import React, { useState, useEffect } from 'react';

import { NewItemModal } from './NewItemModal';

import './Panel.scss';

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

  const onEdit = (item) => {
    // TODO: use path instead?
    // Add /new?itemId even so that we can re-fetch instead of setting state?
    // or /edit?itemId
    setEditedItem(item);
    setEditing(true);
  };

  const createNew = () => {
    // TODO: use path instead?
    // Add /new
    setEditedItem(null);
    setCreating(true);
  };

  const onClose = () => {
    // TODO: use path instead? Remove /new
    setCreating(false);
    setEditing(false);
  };

  const onSaved = async () => {
    await fetch(setItems);
    // TODO: use path instead? Remove /new
    setCreating(false);
    setEditing(false);
    setSelected(null);
  };

  const onClear = async () => {
    await clear();
    await fetch(setItems);
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
            {children.create(onClose, onSaved, editedItem)}
          </NewItemModal>
        )}
      </div>
      <i className="material-icons resizer">height</i>
    </div>
  );
}
