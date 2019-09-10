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

  return (
    <>
      <h1>Stubs</h1>
      <button className="newStubBtn" onClick={() => setCreating(true)}>
        New
      </button>
      {creating && <NewStub afterSuccessfulCreation={onStubCreated} />}
      <div className="stubs">
        <StubsList stubs={stubs} selected={selected} setSelected={setSelected} />
        {selected && <SelectedStub selectedStub={selected} />}
      </div>
    </>
  );
}

export const fetchStubs = async set => {
  const res = await axios.get('/stubs');
  set(res.data);
};
