import React, { useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { SaveButton } from '../prototypes/stubsComponents/SaveButton';
import { UrlMatcher } from '../prototypes/matching/UrlMatcher';

const { stubFor } = require('@stub4/client');

const defaults = {
  requestMatcher: { url: '' },
  crud: { idAlias: '', patchOnPost: false }
};
export function CrudEditor({ onClose, onSaved, editedItem }) {
  const routeMatch = useRouteMatch();
  const [urlMatcher, setUrlMatcher] = useState({
    ...defaults.requestMatcher,
    ...editedItem?.requestMatcher
  });

  const [crud, setCrud] = useState({
    ...defaults.crud,
    ...editedItem?.crud
  });

  async function onSave() {
    await stubFor({
      id: routeMatch?.params?.id,
      requestMatcher: { url: urlMatcher.url },
      crud
    });
    onSaved();
  }

  return (
    <div onKeyDown={(e) => e.keyCode === 27 && onClose()}>
      <UrlMatcher urlMatcher={urlMatcher.url} onChange={(url) => setUrlMatcher({ url })} />

      <div>
        <label className="itemLabel" htmlFor="idAlias">
          ID ALIAS
        </label>
        <input
          id="idAlias"
          type="text"
          onChange={(event) => setCrud({ ...crud, idAlias: event.target.value })}
          value={crud.idAlias}
        />
      </div>

      <label className="itemLabel" htmlFor="patchOnPostCheckbox">
        PATCH ON POST
      </label>
      <input
        id="patchOnPostCheckbox"
        type="checkbox"
        className="bodyMatchCheckbox"
        onChange={(event) => setCrud({ ...crud, patchOnPost: event.target.checked })}
        checked={crud.patchOnPost}
      />

      <SaveButton onSave={onSave} />
    </div>
  );
}
