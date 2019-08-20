import axios from 'axios';
import React, { useState } from 'react';

import './NewStub.scss';

function NewStub({ onCreation }) {
  const [url, setUrl] = useState('/');
  const [method, setMethod] = useState('GET');

  const [body, setBody] = useState('');
  const [type, setType] = useState('text');

  const setup = async () => {
    await axios.post('/new-stub', {
      requestMatcher: { url, method },
      response: { type, body }
    });
    onCreation();
  };

  const handle = setFn => event => setFn(event.target.value);

  return (
    <div className="newStub">
      <button onClick={setup}>Save</button>
      <br />
      <label htmlFor="method">METHOD</label>
      <input id="method" type="text" onChange={handle(setMethod)} value={method} />
      <br />

      <label htmlFor="url">URL</label>
      <input id="url" type="text" onChange={handle(setUrl)} value={url} />
      <br />

      <label htmlFor="type">TYPE</label>
      <input id="type" type="text" onChange={handle(setType)} value={type} />
      <br />

      <label htmlFor="body">BODY</label>
      <input id="body" type="text" onChange={handle(setBody)} value={body} />
    </div>
  );
}

export default NewStub;
