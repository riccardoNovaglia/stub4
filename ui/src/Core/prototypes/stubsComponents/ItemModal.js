import React from 'react';

import './New.scss';

export function NewItemModal(props) {
  return <Modal title={`Create new ${props.itemName}`} {...props} />;
}

export function ItemModal(props) {
  return <Modal title={`A ${props.itemName}`} {...props} />;
}

function Modal({ title, onClose, children }) {
  return (
    <>
      <div className="new" onKeyDown={(e) => e.keyCode === 27 && onClose()}>
        <h1 className="newItemTitle">
          {title}
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
