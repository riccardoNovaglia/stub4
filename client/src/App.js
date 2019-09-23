import React, { useState } from 'react';

import { Stubs } from './stubs/Stubs';
import { Cruds } from './cruds/Cruds';

import './App.scss';

function App() {
  const [tab, setCurrentTab] = useState('stubs');

  return (
    <div className="App">
      <button onClick={() => setCurrentTab('stubs')}>Stubs</button>
      <button onClick={() => setCurrentTab('cruds')}>Cruds</button>
      {tab === 'stubs' && <Stubs />}
      {tab === 'cruds' && <Cruds />}
    </div>
  );
}

export default App;
