import React, { useState } from 'react';

import * as crudClient from './CrudClient';

import './NewCrud.scss';

export function NewCrud({ afterSuccessfulCreation }) {
  const [url, setUrl] = useState('');
  const [idAlias, setIdAlias] = useState(undefined);

  const setup = async () => {
    crudClient.createCrud(`/${url}`, idAlias);
    afterSuccessfulCreation();
  };

  const handle = setFn => event => setFn(event.target.value);

  return (
    <div className="newCrud">
      <button onClick={setup}>Save</button>

      <div>
        <label htmlFor="url">URL</label>
        <span className="leadingSlash">/</span>
        <input id="url" type="text" onChange={handle(setUrl)} value={url} />
      </div>

      <div>
        <label htmlFor="idAlias">id alias (optional)</label>
        <input id="idAlias" type="text" onChange={handle(setIdAlias)} value={idAlias} />
      </div>
    </div>
  );
}
