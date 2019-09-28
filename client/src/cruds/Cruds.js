import axios from 'axios';
import React, { useState } from 'react';

import { CrudsList } from './list/CrudsList';
import { SelectedCrud } from './selected/SelectedCrud';

import './Cruds.scss';

export function Cruds({ cruds, onClear }) {
  const [selected, setSelected] = useState();

  const clear = async () => {
    await clearCruds();
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

const clearCruds = async () => {
  await axios.post('/cruds/clear');
};
