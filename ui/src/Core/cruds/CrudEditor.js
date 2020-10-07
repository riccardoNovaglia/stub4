import React, { useState } from 'react';
import { EnableDisableButton } from '../prototypes/stubsComponents/EnableDisableButton';
import { SaveButton } from '../prototypes/stubsComponents/SaveButton';
import { UrlMatcher } from '../prototypes/matching/UrlMatcher';

const { stubFor, cruds } = require('@stub4/client');

const defaults = {
  requestMatcher: { url: '' },
  crud: { idAlias: '', patchOnPost: false, items: [] }
};
export function CrudEditor({ onClose, onSaved, editedItem }) {
  const id = editedItem?.id;
  const [enabled, setEnabled] = useState(editedItem?.enabled ?? true);
  const [urlMatcher, setUrlMatcher] = useState({
    ...defaults.requestMatcher,
    ...editedItem?.requestMatcher
  });

  const [crud, setCrud] = useState({
    ...defaults.crud,
    ...editedItem?.crud
  });

  async function onSave() {
    await stubFor({ id, requestMatcher: { url: urlMatcher.url }, crud });
    onSaved();
  }

  return (
    <form
      onKeyDown={(e) => e.keyCode === 27 && onClose()}
      className={!enabled ? 'disabledEditor' : ''}
      onSubmit={(event) => {
        event.preventDefault();
        onSave();
      }}
    >
      <EnableDisableButton
        id={editedItem?.id}
        enabled={enabled}
        setEnabled={setEnabled}
        toggleFunction={cruds.setEnabled}
      />

      <fieldset className="editorFieldset" disabled={!enabled}>
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

        <div>
          <label className="itemLabel" htmlFor="contents">
            Contents
          </label>
          <textarea
            id="contents"
            value={toStringIfObject(crud?.items)}
            onChange={(event) =>
              setCrud({
                ...crud,
                items: toJsonIfObject(event.target.value)
              })
            }
            rows="35"
            cols="33"
            className="contents"
          />
        </div>
        <SaveButton onSave={onSave} />
      </fieldset>
    </form>
  );
}

function toStringIfObject(body) {
  return typeof body === 'object' ? JSON.stringify(body, null, 2) : body;
}

function toJsonIfObject(body) {
  try {
    return JSON.parse(body);
  } catch (e) {
    return body;
  }
}
