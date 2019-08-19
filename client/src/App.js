import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './App.css';

function App() {
  const [response, setResponse] = useState('');
  const [count, setCount] = useState(0);
  const [stubs, setStubs] = useState({});

  useEffect(() => {
    const fetchStubs = async () => {
      const res = await axios.get('/stubs');
      setStubs(res.data);
    };
    fetchStubs();
  });

  const setup = async () => {
    setCount(count + 1);
    const res = await axios.post('/new-stub', {
      requestMatcher: { url: '/tis-new' },
      response: { type: 'text', body: `a new one ${count}` }
    });
    console.log('Got a res', res);
  };

  const tryOut = async () => {
    const res = await axios.get('/tis-new', {
      requestMatcher: { url: '/tis-new' }
    });
    console.log('Got a res', res);
    setResponse(res.data);
  };

  return (
    <div className="App">
      <button onClick={setup}>Setup</button>
      <button onClick={tryOut}>Try it out</button>
      <p>The response will go here: {response}</p>
      <p>Here's the current stubs: {JSON.stringify(stubs)}</p>
    </div>
  );
}

export default App;
