import React, { useState } from 'react';
import { Url } from '../prototypes/Url';

export function NewCrud({ onClose, setNewItem, edited }) {
  const defaults = {
    url: '',
    idAlias: '',
    ...edited
  };

  const crud = {
    ...useObject('url', defaults.url),
    ...useObject('idAlias', defaults.idAlias)
  };

  function handle(setFn) {
    return function(event) {
      setFn(event.target.value);
      setNewItem(crud);
    };
  }

  function handleValue(setFn) {
    return function(value) {
      setFn(value);
      setNewItem(crud);
    };
  }

  return (
    <div onKeyDown={e => e.keyCode === 27 && onClose()}>
      <Url url={crud.url} handle={handleValue(crud.url.set)} />

      <div>
        <label htmlFor="idAlias">ID ALIAS</label>
        <input
          id="idAlias"
          type="text"
          onChange={handle(crud.idAlias.set)}
          value={crud.idAlias.value}
        />
      </div>
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
