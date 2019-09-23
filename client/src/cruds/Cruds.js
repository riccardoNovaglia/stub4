import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { CrudsList } from './list/CrudsList';
import { NewCrud } from './new/NewCrud';
import { SelectedCrud } from './selected/SelectedCrud';

import './Cruds.scss';

export function Cruds() {
  const [cruds, setCruds] = useState({});
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState();

  useEffect(() => {
    fetchCruds(setCruds);
  }, [setCruds]);

  const onCrudCreated = async () => {
    await fetchCruds(setCruds);
    setCreating(false);
  };

  return (
    <div>
      <h1 className="crudTitle">Cruds</h1>
      <button className="newCrudBtn" onClick={() => setCreating(true)}>
        New
      </button>
      {creating && <NewCrud afterSuccessfulCreation={onCrudCreated} />}
      <div className="cruds">
        <CrudsList cruds={cruds} selected={selected} setSelected={setSelected} />
        {selected && <SelectedCrud selectedCrud={selected} />}
      </div>
    </div>
  );
}

export const fetchCruds = async set => {
  const res = await axios.get('/cruds');
  set(res.data);
};
