import React from 'react';
import { Url } from '../prototypes/Url';
import { useObject, updatableItem2 } from '../prototypes/NewItemManagement';
import { SaveButton } from '../prototypes/SaveButton';

export function NewProxy({ onClose, onSaved, editedItem, client }) {
  const defaults = {
    request: { url: '' },
    proxyUrl: '',
    ...editedItem
  };

  const proxy = updatableItem2({
    ...useObject('url', defaults.request.url),
    ...useObject('proxyUrl', defaults.proxyUrl)
  });

  function handleValue(setFn, key) {
    return function(value) {
      proxy.updateFromValue(setFn, key, value);
    };
  }

  async function onSave() {
    await client.proxyRequests(proxy.url.value, proxy.proxyUrl.value);
    onSaved();
  }

  return (
    <div onKeyDown={e => e.keyCode === 27 && onClose()}>
      <Url url={proxy.url} handle={handleValue(proxy.url.set, 'url')} />

      <Url
        label="PROXY URL"
        focus={false}
        url={proxy.proxyUrl}
        handle={handleValue(proxy.proxyUrl.set, 'proxyUrl')}
      />

      <SaveButton onSave={onSave} />
    </div>
  );
}
