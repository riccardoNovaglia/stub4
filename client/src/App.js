import React, { useState } from 'react';

import { Stubs } from './stubs/Stubs';
import { DBs } from './dbs/DBs';

import './App.scss';

function App() {
  const [tab, setCurrentTab] = useState('stubs');

  return (
    <div className="App">
      <button onClick={() => setCurrentTab('stubs')}>Stubs</button>
      <button onClick={() => setCurrentTab('dbs')}>DBs</button>
      {tab === 'stubs' && <Stubs />}
      {tab === 'dbs' && <DBs />}
    </div>
  );
}

export default App;
