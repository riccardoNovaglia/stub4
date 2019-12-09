import React from 'react';
import { Url } from '../prototypes/Url';
import { useObject, updatableItem } from '../prototypes/NewItemManagement';

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

  const stub = updatableItem(
    {
      ...useObject('url', defaults.urlMatcher.url),
      ...useObject('method', defaults.method),
      ...useObject('status', defaults.response.statusCode),
      ...useObject('body', defaults.response.body),
      ...useObject('type', defaults.response.contentType)
    },
    setNewItem
  );

  function handle(setFn, key) {
    return function(event) {
      stub.updateFromEvent(setFn, key, event);
    };
  }

  function handleValue(setFn, key) {
    return function(value) {
      stub.updateFromValue(setFn, key, value);
    };
  }

  return (
    <div onKeyDown={e => e.keyCode === 27 && onClose()}>
      <Url url={stub.url} handle={handleValue(stub.url.set, 'url')} />
      <div>
        <label htmlFor="method">METHOD</label>
        <select value={stub.method.value} onChange={handle(stub.method.set, 'method')}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
        </select>
      </div>

      <div>
        <label htmlFor="status">STATUS</label>
        <input
          id="status"
          type="text"
          onChange={handle(stub.status.set, 'status')}
          value={stub.status.value}
        />
      </div>

      <div>
        <label htmlFor="type">TYPE</label>
        <select value={stub.type.value} onChange={handle(stub.type.set, 'type')}>
          <option value="text">text/plain</option>
          <option value="json">application/json</option>
          <option value="xml">application/xml</option>
        </select>
      </div>

      <div>
        <label htmlFor="body">BODY</label>
        <textarea
          id="body"
          className="responseBody"
          onChange={handle(stub.body.set, 'body')}
          rows="5"
          cols="33"
          value={stub.body.value}
        />
      </div>
    </div>
  );
}
