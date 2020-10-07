import React, { useState } from 'react';
import { EnableDisableButton } from '../prototypes/stubsComponents/EnableDisableButton';
import { SaveButton } from '../prototypes/stubsComponents/SaveButton';
import { RequestMatcher } from '../prototypes/matching/RequestMatcher';

import { stubFor, proxy as proxys } from '@stub4/client';

const defaults = {
  requestMatcher: { url: '' },
  proxy: { destinationUrl: '' }
};
export function ProxyEditor({ onClose, onSaved, editedItem }) {
  const id = editedItem?.id;
  const [enabled, setEnabled] = useState(editedItem?.enabled ?? true);
  const [requestMatcher, setRequestMatcher] = useState({
    ...defaults.requestMatcher,
    ...editedItem?.requestMatcher
  });
  const [proxy, setProxyDef] = useState({
    ...defaults.proxy,
    ...editedItem?.proxy
  });

  async function onSave() {
    await stubFor({ id, requestMatcher, proxy });
    onSaved();
  }

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
        id={editedItem?.id}
        enabled={enabled}
        setEnabled={setEnabled}
        toggleFunction={proxys.setEnabled}
      />

      <fieldset className="editorFieldset" disabled={!enabled}>
        <RequestMatcher requestMatcher={requestMatcher} setRequestMatcher={setRequestMatcher} />

        <div>
          <h3>Proxy to</h3>
          <label className="itemLabel" htmlFor="destinationUrl">
            PROXY URL
          </label>
          <input
            id="destinationUrl"
            type="text"
            onChange={(event) => setProxyDef({ ...proxy, destinationUrl: event.target.value })}
            value={proxy.destinationUrl}
          />
        </div>

        <SaveButton onSave={onSave} />
      </fieldset>
    </form>
  );
}
