import React from 'react';

import { Url } from './Url';

export function Stub({ stub, handle }) {
  return (
    <>
      <Url url={stub.url} handle={handle} />

      <div>
        <label htmlFor="method">METHOD</label>
        <select value={stub.method.value} onChange={handle(stub.method.set)}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
        </select>
      </div>

      <div>
        <label htmlFor="status">STATUS</label>
        <input
          id="status"
          type="text"
          onChange={handle(stub.status.set)}
          value={stub.status.value}
        />
      </div>

      <div>
        <label htmlFor="type">TYPE</label>
        <select value={stub.type.value} onChange={handle(stub.type.set)}>
          <option value="text">text/plain</option>
          <option value="json">application/json</option>
        </select>
      </div>

      <div>
        <label htmlFor="body">BODY</label>
        <input id="body" type="text" onChange={handle(stub.body.set)} value={stub.body.value} />
      </div>
    </>
  );
}
