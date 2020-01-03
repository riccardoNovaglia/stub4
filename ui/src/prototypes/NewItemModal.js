import React, { useState } from 'react';

import './New.scss';

export function NewItemModal({ itemName, onClose, save, children }) {
  const [newItem, setNewItem] = useState({});

  return (
    <>
      <div className="new" onKeyDown={e => e.keyCode === 27 && onClose()}>
        <h1>
          Create new {itemName}
          <button onClick={onClose}>
            <i className="material-icons">clear</i>Close
          </button>
        </h1>
        <div>
          {children.create(onClose, setNewItem)}
          <div className="buttonGroup">
            <button onClick={() => save(newItem)}>
              <i className="material-icons">playlist_add</i>Save
            </button>
          </div>
        </div>
      </div>
      <div className="overlay" />
    </>
  );
}
