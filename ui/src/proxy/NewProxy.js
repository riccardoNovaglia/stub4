import React from 'react';
import { SaveButton } from '../prototypes/SaveButton';
import { RequestMatcher } from '../prototypes/RequestMatcher';
import { useObject, updatableItem, handle } from '../prototypes/NewItemManagement';

export function NewProxy({ onClose, onSaved, editedItem, client }) {
  const defaults = {
    request: { url: '' },
    proxyUrl: '',
    ...editedItem
  };

  const proxy = updatableItem({
    ...useObject('url', defaults.request.url),
    ...useObject('proxyUrl', defaults.proxyUrl)
  });

  async function onSave() {
    await client.proxyRequests(proxy.url.value, proxy.proxyUrl.value);
    onSaved();
  }

  return (
    <div onKeyDown={e => e.keyCode === 27 && onClose()}>
      {/* TODO: this needs to become a FullRequestMatcher */}
      <RequestMatcher item={proxy} />

      <div>
        <label htmlFor="url">PROXY URL</label>
        <input
          id="url"
          type="text"
          onChange={handle(proxy)(proxy.proxyUrl.set, 'proxyUrl')}
          value={proxy.proxyUrl.value}
        />
      </div>

      <SaveButton onSave={onSave} />
    </div>
  );
}
