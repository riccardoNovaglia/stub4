import React, { useState } from 'react';

import { CrudsList } from './list/CrudsList';
import { SelectedCrud } from './selected/SelectedCrud';
import Stub4 from '@stub4/stubClient';
import './Cruds.scss';

const crudClient = new Stub4.CrudClient();

export function Cruds({ cruds, onClear }) {
  const [selected, setSelected] = useState();

  const clear = async () => {
    await crudClient.clearCruds();
    onClear();
  };

  return (
    <div>
      <h1 className="crudTitle">Cruds</h1>
      <button className="clearCrudBtn" onClick={clear}>
        CLEAR
      </button>
      <div className="cruds">
        <CrudsList cruds={cruds} selected={selected} setSelected={setSelected} />
        {selected && <SelectedCrud selectedCrud={selected} />}
      </div>
    </div>
  );
}
