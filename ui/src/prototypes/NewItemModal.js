import React from 'react';

import './New.scss';

export function NewItemModal({ itemName, onClose, children }) {
  return (
    <>
      <div className="new" onKeyDown={e => e.keyCode === 27 && onClose()}>
        <h1>
          Create new {itemName}
          <button onClick={onClose}>
            <i className="material-icons">clear</i>Close
          </button>
        </h1>
        <div>{children}</div>
      </div>
      <div className="overlay" />
    </>
  );
}
