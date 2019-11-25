import React, { useState } from 'react';
import { Url } from '../prototypes/Url';

export function NewStub({ onClose, setNewItem, edited }) {
  const defaults = {
    urlMatcher: { url: '' },
    method: 'GET',
    response: {
      statusCode: 200,
      body: '{}',
      contentType: 'application/json'
    },
    ...edited
  };

  const stub = {
    ...useObject('url', defaults.urlMatcher.url),
    ...useObject('method', defaults.method),
    ...useObject('status', defaults.response.statusCode),
    ...useObject('body', defaults.response.body),
    ...useObject('type', defaults.response.contentType)
  };

  function handle(setFn) {
    return function(event) {
      setFn(event.target.value);
      setNewItem(stub);
    };
  }

  function handleValue(setFn) {
    return function(value) {
      setFn(value);
      setNewItem(stub);
    };
  }

  return (
    <div onKeyDown={e => e.keyCode === 27 && onClose()}>
      <Url url={stub.url} handle={handleValue(stub.url.set)} />
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
          <option value="text/plain">text/plain</option>
          <option value="application/json">application/json</option>
          <option value="application/xml">application/xml</option>
        </select>
      </div>

      <div>
        <label htmlFor="body">BODY</label>
        <textarea
          id="body"
          className="responseBody"
          onChange={handle(stub.body.set)}
          rows="5"
          cols="33"
          value={stub.body.value}
        />
      </div>
    </div>
  );
}

function useObject(key, initialValue) {
  const [value, set] = useState(initialValue);
  return {
    [key]: {
      value,
      set
    }
  };
}
