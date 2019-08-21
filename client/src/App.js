import React, { useState, useEffect } from 'react';

import { Stubs, fetchStubs } from './stubs/Stubs';
import NewStub from './newStub/NewStub';

import './App.scss';

function App() {
  const [stubs, setStubs] = useState({});
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchStubs(setStubs);
  }, [setStubs]);

  const onStubCreated = async () => {
    await fetchStubs(setStubs);
    setCreating(false);
  };

  return (
    <div className="App">
      <button className="newStubBtn" onClick={() => setCreating(true)}>
        New
      </button>
      {creating && <NewStub afterSuccessfulCreation={onStubCreated} />}
      <Stubs stubs={stubs} />
    </div>
  );
}

export default App;
