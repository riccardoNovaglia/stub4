import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { NewItemModal } from './ItemModal';

import './Panel.scss';

export function Panel({ itemsLifecycle, presentation, children, pathBased = false }) {
  const history = useHistory();
  const location = useLocation();

  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState();

  const [editedItem, setEditedItem] = useState();

  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);

  const { fetch, clear } = itemsLifecycle;
  const { label, icon, className } = presentation;

  useEffect(() => {
    if (!location.pathname.includes('/edit') && !location.pathname.includes('/new')) {
      fetch(setItems);
    }
  }, [fetch, setItems, location]);

  const onEdit = (item) => {
    if (item?.id !== undefined) {
      history.push(`/stub4/${label}/edit/${item.id}`.toLowerCase());
    } else {
      setEditedItem(item);
      setEditing(true);
    }
  };

  const createNew = () => {
    if (pathBased) {
      history.push(`/stub4/${label}/new`.toLowerCase());
    } else {
      setEditedItem(null);
      setCreating(true);
    }
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
    </div>
  );
}
