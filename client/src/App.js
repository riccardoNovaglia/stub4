import React, { useState } from 'react';
import axios from 'axios';

import './App.css';

function App() {
  const [response, setResponse] = useState('');
  const [count, setCount] = useState(0);

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
    </div>
  );
}

export default App;
