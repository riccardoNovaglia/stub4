import React from 'react';

import { Url } from './Url';

export function Crud({ crud, handle }) {
  return (
    <>
      <Url url={crud.url} handle={handle} />

      <div>
        <label htmlFor="idAlias">ID ALIAS</label>
        <input
          id="idAlias"
          type="text"
          onChange={handle(crud.idAlias.set)}
          value={crud.idAlias.value}
        />
      </div>
    </>
  );
}
