import React, { useState } from 'react';
import { RequestMatcher } from '../prototypes/matching/RequestMatcher';

import { stubFor, proxy as proxys } from '@stub4/client';
import { Editor } from '../prototypes/stubsComponents/Editor';

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

  async function onDelete() {
    await proxys.deleteById(id);
    onClose();
  }

  return (
    <Editor
      enabled={enabled}
      setEnabled={setEnabled}
      toggleEnable={proxys.setEnabled}
      itemId={id}
      onSave={onSave}
      onDelete={onDelete}
      onClose={onClose}
    >
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
    </Editor>
  );
}
