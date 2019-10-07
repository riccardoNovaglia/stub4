import React, { useState } from 'react';

import { CrudsList } from './list/CrudsList';
import { SelectedCrud } from './selected/SelectedCrud';
import Stub4 from '@stub4/stubClient';

const crudClient = new Stub4.CrudClient();

export function Cruds({ cruds, onClear }) {
  const [selected, setSelected] = useState();

  const clear = async () => {
    await crudClient.clearCruds();
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
        {selected && <SelectedCrud selectedCrud={selected} />}
      </div>
    </div>
  );
}
