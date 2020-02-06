import React from 'react';
import { SaveButton } from '../prototypes/SaveButton';
import { RequestMatcher } from '../prototypes/RequestMatcher';
import { useObject, updatableItem, handle } from '../prototypes/NewItemManagement';

export function NewCrud({ onClose, onSaved, editedItem, client }) {
  const defaults = {
    url: '',
    idAlias: '',
    ...editedItem
  };

  const crud = updatableItem({
    ...useObject('url', defaults.url),
    ...useObject('idAlias', defaults.idAlias)
  });

  async function onSave() {
    await client.createCrud(crud.url.value, crud.idAlias.value);
    onSaved();
  }

  return (
    <div onKeyDown={e => e.keyCode === 27 && onClose()}>
      <RequestMatcher item={crud} />

      <div>
        <label htmlFor="idAlias">ID ALIAS</label>
        <input
          id="idAlias"
          type="text"
          onChange={handle(crud)(crud.idAlias.set, 'idAlias')}
          value={crud.idAlias.value}
        />
      </div>

      <SaveButton onSave={onSave} />
    </div>
  );
}
