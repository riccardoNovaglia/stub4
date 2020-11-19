import { useState } from 'react';
import { RequestMatcher } from '../prototypes/matching/RequestMatcher';
import { EnableDisableButton } from '../prototypes/stubsComponents/EnableDisableButton';

const { scenarios } = require('@stub4/client');

const defaults = {
  requestMatcher: { url: '' }
};

export function ScenarioEditor({ onClose, editedItem }) {
  const id = editedItem?.id;
  const [enabled, setEnabled] = useState(editedItem?.enabled ?? true);
  const [requestMatcher, setRequestMatcher] = useState({
    ...defaults.requestMatcher,
    ...editedItem?.requestMatcher
  });

  async function onSave() {}

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
        id={id}
        enabled={enabled}
        setEnabled={setEnabled}
        toggleFunction={scenarios.setEnabled}
      />
      <fieldset className="editorFieldset" disabled={!enabled}>
        <RequestMatcher requestMatcher={requestMatcher} setRequestMatcher={setRequestMatcher} />

        <br />

        <p>Bear with... work in progress.. but here's the definition?</p>

        <textarea rows={30} cols={60} value={JSON.stringify(editedItem?.scenarios, null, 2)} />

        {/* <SaveButton onSave={onSave} /> */}
        {/* TODO: add delete */}
      </fieldset>
    </form>
  );
}

// function toStringIfObject(body) {
//   return typeof body === 'object' ? JSON.stringify(body) : body;
// }
