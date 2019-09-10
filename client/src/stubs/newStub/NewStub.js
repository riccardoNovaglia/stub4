import React, { useState } from 'react';

import './NewStub.scss';
import { stub, request } from './StubClient';

function NewStub({ afterSuccessfulCreation }) {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');

  const [body, setBody] = useState('');
  const [type, setType] = useState('text');

  const setup = async () => {
    await stub(request(method, `/${url}`).returns(type, body));
    afterSuccessfulCreation();
  };

  const handle = setFn => event => setFn(event.target.value);

  return (
    <div className="newStub">
      <button onClick={setup}>Save</button>

      <div>
        <label htmlFor="method">METHOD</label>
        <select value={method} onChange={handle(setMethod)}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
        </select>
      </div>

      <div>
        <label htmlFor="url">URL</label>
        <span className="leadingSlash">/</span>
        <input id="url" type="text" onChange={handle(setUrl)} value={url} />
      </div>

      <div>
        <label htmlFor="type">TYPE</label>
        <select value={type} onChange={handle(setType)}>
          <option value="text">text/plain</option>
          <option value="json">application/json</option>
        </select>
      </div>

      <div>
        <label htmlFor="body">BODY</label>
        <input id="body" type="text" onChange={handle(setBody)} value={body} />
      </div>
    </div>
  );
}

export default NewStub;
