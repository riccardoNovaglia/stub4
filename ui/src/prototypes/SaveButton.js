import React from 'react';

export function SaveButton({ onSave }) {
  return (
    <div className="buttonGroup">
      <button onClick={onSave}>
        <i className="material-icons">playlist_add</i>Save
      </button>
    </div>
  );
}
