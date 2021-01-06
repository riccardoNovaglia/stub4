import { EnableDisableButton } from './EnableDisableButton';
import { SaveAndDeleteButtons } from './SaveAndDeleteButtons';
import { CopyToClipboardButton } from './CopyToClipboard';

export function Editor({
  enabled,
  setEnabled,
  toggleEnable,
  itemId,
  onSave,
  onDelete,
  onClose,
  stubbingDefinition = null,
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
        {stubbingDefinition && <CopyToClipboardButton itemDefinition={stubbingDefinition} />}
      </fieldset>
    </form>
  );
}
