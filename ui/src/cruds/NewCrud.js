import React from 'react';
import { Url } from '../prototypes/Url';
import { useObject, updatableItem } from '../prototypes/NewItemManagement';

export function NewCrud({ onClose, setNewItem, edited }) {
  const defaults = {
    url: '',
    idAlias: '',
    ...edited
  };

  const crud = updatableItem(
    {
      ...useObject('url', defaults.url),
      ...useObject('idAlias', defaults.idAlias)
    },
    setNewItem
  );

  function handle(setFn, key) {
    return function(event) {
      crud.updateFromEvent(setFn, key, event);
    };
  }

  function handleValue(setFn, key) {
    return function(value) {
      crud.updateFromValue(setFn, key, value);
    };
  }

  return (
    <div onKeyDown={e => e.keyCode === 27 && onClose()}>
      <Url url={crud.url} handle={handleValue(crud.url.set, 'url')} />

      <div>
        <label htmlFor="idAlias">ID ALIAS</label>
        <input
          id="idAlias"
          type="text"
          onChange={handle(crud.idAlias.set, 'idAlias')}
          value={crud.idAlias.value}
        />
      </div>
    </div>
  );
}
