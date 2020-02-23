import React from 'react';
import { SaveButton } from '../prototypes/SaveButton';
import { RequestMatcher } from '../prototypes/RequestMatcher';
import { useObject, updatableItem, handle } from '../prototypes/NewItemManagement';

const { stubFor } = require('@stub4/client');

export function NewCrud({ onClose, onSaved, editedItem }) {
  const defaults = {
    requestMatcher: { url: '' },
    crud: { idAlias: '' },
    ...editedItem
  };

  const crud = updatableItem({
    ...useObject('url', defaults.requestMatcher.url),
    ...useObject('idAlias', defaults.crud.idAlias)
  });

  async function onSave() {
    await stubFor({
      requestMatcher: { url: crud.url.value },
      crud: { idAlias: crud.idAlias.value, patchOnPost: false } // TODO: patchOnPost
    });
    onSaved();
  }

  return (
    <div onKeyDown={e => e.keyCode === 27 && onClose()}>
      <RequestMatcher item={crud} />

      <div>
        <label className="itemLabel" htmlFor="idAlias">
          ID ALIAS
        </label>
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
