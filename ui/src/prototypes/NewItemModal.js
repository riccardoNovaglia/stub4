import React, { useState } from 'react';

export function NewItemModal({ itemName, create, onClose, save, edited }) {
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
          {create ? create({ onClose, setNewItem, edited }) : <p>Create would go here</p>}
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
