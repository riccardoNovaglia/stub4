import React, { useState } from 'react';

import { StubsList } from './list/StubsList';
import { SelectedStub } from './selected/SelectedStub';
import Stub4 from '@stub4/stubClient';

import './Stub.scss';

const stubClient = new Stub4.StubClient();

export function Stubs({ stubs, onClear, setStarter }) {
  const [selected, setSelected] = useState();

  const clear = async () => {
    await stubClient.clearStubs();
    onClear();
  };

  return (
    <div className="panel">
      <h1>Stubs</h1>
      <button className="clearBtn" onClick={clear}>
        CLEAR
      </button>
      <div className="stubs">
        <StubsList stubs={stubs} selected={selected} setSelected={setSelected} />
        {selected && <SelectedStub selectedStub={selected} setStarter={setStarter} />}
      </div>
    </div>
  );
}
