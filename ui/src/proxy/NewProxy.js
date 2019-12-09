import React, { useState } from 'react';
import { Url } from '../prototypes/Url';

export function NewProxy({ onClose, setNewItem, edited }) {
  const defaults = {
    url: '',
    proxyUrl: '',
    ...edited
  };

  // TODO: update me following stub, crud
  const proxy = {
    ...useObject('url', defaults.url),
    ...useObject('proxyUrl', defaults.proxyUrl)
  };

  function handleValue(setFn) {
    return function(value) {
      setFn(value);
      setNewItem(proxy);
    };
  }

  return (
    <div onKeyDown={e => e.keyCode === 27 && onClose()}>
      <Url url={proxy.url} handle={handleValue(proxy.url.set)} />

      <Url
        label="PROXY URL"
        focus={false}
        url={proxy.proxyUrl}
        handle={handleValue(proxy.proxyUrl.set)}
      />
    </div>
  );
}

function useObject(key, initialValue) {
  const [value, set] = useState(initialValue);
  return {
    [key]: {
      value,
      set
    }
  };
}
