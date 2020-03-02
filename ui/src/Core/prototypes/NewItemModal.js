import React from 'react';

import './New.scss';

export function NewItemModal({ itemName, onClose, children }) {
  return (
    <>
      <div className="new" onKeyDown={e => e.keyCode === 27 && onClose()}>
        <h1 className="newItemTitle">
          Create new {itemName}
          <button className="closeButton" onClick={onClose}>
            <i className="material-icons">clear</i>Close
          </button>
        </h1>
        <div className="newItemContents">{children}</div>
      </div>
      <div className="modalBackgroundOverlay" />
    </>
  );
}
