import React, { useState, useEffect } from 'react';

import { CrudsList } from './list/CrudsList';
import { SelectedCrud } from './selected/SelectedCrud';

export function Cruds({ onClear, client }) {
  const [selected, setSelected] = useState();
  const [cruds, setCruds] = useState([]);
  useEffect(() => {
    client.fetchCruds(setCruds);
  }, [setCruds, client]);

  const clear = async () => {
    await client.clearCruds();
    onClear();
  };

  return (
    <div className="panel">
      <h1>
        Cruds<i className="material-icons">swap_horiz</i>
      </h1>
      <button className="clearBtn" onClick={clear}>
        <i className="material-icons">clear_all</i>Clear
      </button>
      <div className="cruds">
        <CrudsList cruds={cruds} selected={selected} setSelected={setSelected} />
        {selected && <SelectedCrud selectedCrud={selected} client={client} />}
      </div>
    </div>
  );
}
