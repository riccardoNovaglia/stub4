import React from 'react';

import './Proxy.scss';

export function SelectedProxy({ selected, onEdit }) {
  return (
    <>
      <div className="selectedProxy">
        <div>{selected.requestMatcher.url}</div>
        <div>↓</div>
        <div>{selected.proxyUrl}</div>
        <button className="newButton" onClick={() => onEdit(selected)}>
          Edit
        </button>
      </div>
    </>
  );
}
