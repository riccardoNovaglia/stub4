import React from 'react';
import { Url } from '../prototypes/Url';
import { useObject, updatableItem } from '../prototypes/NewItemManagement';

export function NewProxy({ onClose, setNewItem, edited }) {
  const defaults = {
    request: { url: '' },
    proxyUrl: '',
    ...edited
  };

  const proxy = updatableItem(
    {
      ...useObject('url', defaults.request.url),
      ...useObject('proxyUrl', defaults.proxyUrl)
    },
    setNewItem
  );

  function handleValue(setFn, key) {
    return function(value) {
      proxy.updateFromValue(setFn, key, value);
    };
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
    </div>
  );
}
