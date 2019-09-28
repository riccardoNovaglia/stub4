import React, { useState } from 'react';

import './NewStub.scss';
import { stub, request } from './StubClient';

function NewStub(props) {
  const [url, setUrl] = useState(props.url);
  const [method, setMethod] = useState(props.method);

  const [status, setStatus] = useState(200);
  const [body, setBody] = useState('');
  const [type, setType] = useState('text');

  const setup = async () => {
    await stub(request(method, `${url}`).returns(type, body, status));
    props.afterSuccessfulCreation();
  };

  const handle = setFn => event => setFn(event.target.value);

  return (
    <div className="newStub">
      <button onClick={setup}>Save</button>

      <div>
        <label htmlFor="method">METHOD</label>
        <select value={method} onChange={handle(setMethod)} disabled>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
        </select>
      </div>

      <div>
        <label htmlFor="url">URL</label>
        <input id="url" type="text" onChange={handle(setUrl)} value={url} disabled />
      </div>

      <div>
        <label htmlFor="status">STATUS</label>
        <input id="status" type="text" onChange={handle(setStatus)} value={status} />
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
