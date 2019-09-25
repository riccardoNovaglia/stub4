import axios from 'axios';
import React, { useEffect, useState } from 'react';

import NewStub from './newStub/NewStub';
import { StubsList } from './list/StubsList';
import { SelectedStub } from './selected/SelectedStub';

import './Stub.scss';

export function Stubs() {
  const [stubs, setStubs] = useState({});
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState();

  useEffect(() => {
    fetchStubs(setStubs);
  }, [setStubs]);

  const onStubCreated = async () => {
    await fetchStubs(setStubs);
    setCreating(false);
  };

  const clear = async () => {
    await clearStubs();
    await fetchStubs(setStubs);
  };

  return (
    <div>
      <h1 className="stubTitle">Stubs</h1>
      <button className="newStubBtn" onClick={() => setCreating(true)}>
        New
      </button>
      <button className="clearStubBtn" onClick={() => clear()}>
        CLEAR
      </button>
      {creating && <NewStub afterSuccessfulCreation={onStubCreated} />}
      <div className="stubs">
        <StubsList stubs={stubs} selected={selected} setSelected={setSelected} />
        {selected && <SelectedStub selectedStub={selected} />}
      </div>
    </div>
  );
}

const fetchStubs = async set => {
  const res = await axios.get('/stubs');
  set(res.data);
};

const clearStubs = async () => {
  await axios.post('/stubs/clear');
};
