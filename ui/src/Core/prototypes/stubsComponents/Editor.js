import { EnableDisableButton } from './EnableDisableButton';
import { SaveAndDeleteButtons } from './SaveAndDeleteButtons';

export function Editor({
  enabled,
  setEnabled,
  toggleEnable,
  itemId,
  onSave,
  onDelete,
  onClose,
  itemForPreview = null,
  children
}) {
  return (
    <form
      onKeyDown={(e) => e.keyCode === 27 && onClose()}
      className={!enabled ? 'disabledEditor' : ''}
      onSubmit={(event) => {
        event.preventDefault();
        onSave();
      }}
    >
      <EnableDisableButton
        id={itemId}
        enabled={enabled}
        setEnabled={setEnabled}
        toggleFunction={toggleEnable}
      />

      <fieldset className="editorFieldset" disabled={!enabled}>
        {children}

        <SaveAndDeleteButtons onSave={onSave} onDelete={onDelete} />
        {/* {JSON.stringify(itemForPreview)} */}
      </fieldset>
    </form>
  );
}
