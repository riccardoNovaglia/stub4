import React, { useState } from 'react';
import { SaveButton } from '../prototypes/stubsComponents/SaveButton';
import { RequestMatcher } from '../prototypes/matching/RequestMatcher';

import { stubFor } from '@stub4/client';

const defaults = {
  requestMatcher: { url: '' },
  proxy: { destinationUrl: '' }
};
export function NewProxy({ onClose, onSaved, editedItem }) {
  const [requestMatcher, setRequestMatcher] = useState({
    ...defaults.requestMatcher,
    ...editedItem?.requestMatcher
  });
  const [proxy, setProxyDef] = useState({
    ...defaults.proxy,
    ...editedItem?.proxy
  });

  async function onSave() {
    await stubFor({ requestMatcher, proxy });
    onSaved();
  }

  return (
    <div onKeyDown={(e) => e.keyCode === 27 && onClose()}>
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
    </div>
  );
}
