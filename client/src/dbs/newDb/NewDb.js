import React, { useState } from 'react';

import * as dbClient from './DbClient';

import './NewDb.scss';

export function NewDb({ afterSuccessfulCreation }) {
  const [url, setUrl] = useState('');
  const [idAlias, setIdAlias] = useState(undefined);

  const setup = async () => {
    dbClient.createDb(`/${url}`, idAlias);
    afterSuccessfulCreation();
  };

  const handle = setFn => event => setFn(event.target.value);

  return (
    <div className="newDb">
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
