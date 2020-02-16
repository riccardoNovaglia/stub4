import React from 'react';
import { SaveButton } from '../prototypes/SaveButton';
import { RequestMatcher } from '../prototypes/RequestMatcher';
import { useObject, updatableItem, handle } from '../prototypes/NewItemManagement';

const { stubFor } = require('@stub4/client');
const { request } = require('@stub4/client/src/RequestMatcher');
const { containsCrud } = require('@stub4/client/src/Crud');

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
    await stubFor(request(crud.url.value), containsCrud().withIdAlias(crud.idAlias.value));
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
