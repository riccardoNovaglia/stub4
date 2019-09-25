import axios from 'axios';
import React, { useState } from 'react';

import { Stubs } from './stubs/Stubs';
import { Cruds } from './cruds/Cruds';

import './App.scss';

function App() {
  const [tab, setCurrentTab] = useState('stubs');
  const [pactsCreated, setPactsCreated] = useState(false);

  async function contracts() {
    await generateContracts();
    setPactsCreated(true);
  }

  return (
    <div className="App">
      <button onClick={() => setCurrentTab('stubs')}>Stubs</button>
      <button onClick={() => setCurrentTab('cruds')}>Cruds</button>
      <button onClick={() => contracts()}>Generate Contracts</button> {pactsCreated && <p>Ok</p>}
      {tab === 'stubs' && <Stubs />}
      {tab === 'cruds' && <Cruds />}
    </div>
  );
}

const generateContracts = async () => {
  await axios.post('/generate-pact', { consumer: 'SomeApp' });
};

export default App;
