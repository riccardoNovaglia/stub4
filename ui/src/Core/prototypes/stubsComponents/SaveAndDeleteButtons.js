export function SaveButton({ onSave }) {
  return (
    <div className="buttonGroup">
      <button className="saveButton" onClick={onSave}>
        <i className="material-icons">playlist_add</i>Save
      </button>
    </div>
  );
}

export function DeleteButton({ onDelete }) {
  return (
    <div className="buttonGroup">
      <button className="deleteButton" onClick={onDelete}>
        <i className="material-icons">playlist_add</i>Save
      </button>
    </div>
  );
}

export function SaveAndDeleteButtons({ onSave, onDelete }) {
  return (
    <div className="buttonGroup">
      <button className="saveButton" onClick={onSave}>
        <i className="material-icons">playlist_add</i>Save
      </button>
      <button className="deleteButton" onClick={onDelete}>
        <i className="material-icons">cancel</i>Delete
      </button>
    </div>
  );
}
