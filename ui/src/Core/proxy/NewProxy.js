import React, { useState } from 'react';
import { SaveButton } from '../prototypes/SaveButton';
import { RequestMatcherV2 } from '../prototypes/RequestMatcherV2';
import { useObject, updatableItem } from '../prototypes/NewItemManagement';

import { stubFor } from '@stub4/client';

export function NewProxy({ onClose, onSaved, editedItem, client }) {
  const defaults = {
    requestMatcher: { urlMatcher: { url: '' } },
    proxyUrl: '',
    ...editedItem
  };

  const proxy = updatableItem({
    ...useObject('url', defaults.requestMatcher.url),
    ...useObject('proxyUrl', defaults.proxyUrl)
  });

  const [requestMatcher, setRequestMatcher] = useState(defaults.requestMatcher);
  const [proxyDef, setProxyDef] = useState({ proxyUrl: defaults.proxyUrl });

  async function onSave() {
    await client.proxyRequests(proxy.url.value, proxy.proxyUrl.value);
    await stubFor(requestMatcher, { proxy: proxyDef });
    onSaved();
  }

  return (
    <div onKeyDown={(e) => e.keyCode === 27 && onClose()}>
      <RequestMatcherV2 requestMatcher={requestMatcher} setRequestMatcher={setRequestMatcher} />

      <div>
        <h3>Proxy to</h3>
        <label className="itemLabel" htmlFor="url">
          PROXY URL
        </label>
        <input
          id="url"
          type="text"
          onChange={(event) => setProxyDef({ proxyUrl: event.target.value })}
          value={proxyDef.proxyUrl}
        />
      </div>

      <SaveButton onSave={onSave} />
    </div>
  );
}
