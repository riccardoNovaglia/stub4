import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { DBsList } from './list/DBsList';
import { NewDb } from './newDb/NewDb';
import { SelectedDb } from './selected/SelectedDb';

import './DBs.scss';

export function DBs() {
  const [dbs, setDBs] = useState({});
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState();

  useEffect(() => {
    fetchDBs(setDBs);
  }, [setDBs]);

  const onDbCreated = async () => {
    await fetchDBs(setDBs);
    setCreating(false);
  };

  return (
    <>
      <h1>DBs</h1>
      <button className="newDbBtn" onClick={() => setCreating(true)}>
        New
      </button>
      {creating && <NewDb afterSuccessfulCreation={onDbCreated} />}
      <div className="dbs">
        <DBsList dbs={dbs} selected={selected} setSelected={setSelected} />
        {selected && <SelectedDb selectedDb={selected} />}
      </div>
    </>
  );
}

export const fetchDBs = async set => {
  const res = await axios.get('/dbs');
  set(res.data);
};
