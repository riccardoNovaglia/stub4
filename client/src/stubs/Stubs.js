import React, { useState, useEffect } from 'react';

import { StubsList } from './list/StubsList';
import { SelectedStub } from './selected/SelectedStub';

import './Stub.scss';

export function Stubs({ onClear, setStarter, client }) {
  const [stubs, setStubs] = useState([]);
  useEffect(() => {
    client.fetchStubs(setStubs);
  }, [setStubs, client]);

  const [selected, setSelected] = useState();

  const clear = async () => {
    await client.clearStubs();
    onClear();
  };

  return (
    <div className="panel">
      <h1>
        Stubs<i className="material-icons">import_export</i>
      </h1>
      <button className="clearBtn" onClick={clear}>
        <i className="material-icons">clear_all</i>Clear
      </button>
      <div className="stubs">
        <StubsList stubs={stubs} selected={selected} setSelected={setSelected} />
        {selected && (
          <SelectedStub selectedStub={selected} setStarter={setStarter} client={client} />
        )}
      </div>
      <i className="material-icons resizer">height</i>
    </div>
  );
}
