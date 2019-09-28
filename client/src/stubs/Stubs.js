import axios from 'axios';
import React, { useState } from 'react';

import { StubsList } from './list/StubsList';
import { SelectedStub } from './selected/SelectedStub';

import './Stub.scss';

export function Stubs({ stubs, onClear, setStarter }) {
  const [selected, setSelected] = useState();

  const clear = async () => {
    await clearStubs();
    onClear();
  };

  return (
    <div>
      <h1 className="stubTitle">Stubs</h1>
      <button className="clearStubBtn" onClick={clear}>
        CLEAR
      </button>
      <div className="stubs">
        <StubsList stubs={stubs} selected={selected} setSelected={setSelected} />
        {selected && <SelectedStub selectedStub={selected} setStarter={setStarter} />}
      </div>
    </div>
  );
}

const clearStubs = async () => {
  await axios.post('/stubs/clear');
};
