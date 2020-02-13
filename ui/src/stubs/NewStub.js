import React, { useState } from 'react';
import { isEmpty } from 'lodash';

import { useObject, updatableItem, handle } from '../prototypes/NewItemManagement';
import { FullRequestMatcher } from '../prototypes/RequestMatcher';
import { SaveButton } from '../prototypes/SaveButton';

const { stubFor } = require('@stub4/client');
const { request } = require('@stub4/client/src/RequestMatcher');
const { respondsWith } = require('@stub4/client/src/StubResponse');

const asStringIfObject = item => (typeof item === 'object' ? JSON.stringify(item) : item);
const asObjectIfString = item => (typeof item === 'string' ? JSON.parse(item) : item);

export function NewStub({ onClose, onSaved, editedItem }) {
  const defaults = {
    urlMatcher: { url: '' },
    method: 'GET',
    response: {
      statusCode: 200,
      body: '{}',
      contentType: 'application/json'
    },
    ...editedItem
  };

  const stub = updatableItem({
    ...useObject('url', defaults.urlMatcher.url),
    ...useObject('method', defaults.method),
    ...useObject('status', defaults.response.statusCode),
    ...useObject('body', asStringIfObject(defaults.response.body)),
    ...useObject('type', defaults.response.contentType)
  });

  function getBodyMatcherValue(item) {
    return isEmpty(item?.bodyMatcher)
      ? undefined
      : { body: JSON.stringify(item.bodyMatcher.body), type: item.bodyMatcher.type };
  }

  const [bodyMatcher, setBodyMatcher] = useState(getBodyMatcherValue(editedItem));

  async function onSave() {
    // TODO: a method to setup everything from one JSON object
    const req =
      bodyMatcher !== undefined
        ? request(stub.url.value)
            .withMethod(stub.method.value)
            .withBody(asObjectIfString(bodyMatcher.body))
            .withType(bodyMatcher.type)
        : request(stub.url.value).withMethod(stub.method.value);

    await stubFor(req, respondsWith(stub.status.value, stub.type.value, stub.body.value));
    onSaved();
  }

  return (
    <div onKeyDown={e => e.keyCode === 27 && onClose()}>
      <FullRequestMatcher item={stub} bodyMatcher={bodyMatcher} setBodyMatcher={setBodyMatcher} />

      <br />
      <h3>Response: </h3>
      <div>
        <label className="itemLabel" htmlFor="status">
          STATUS
        </label>
        <input
          id="status"
          type="text"
          onChange={handle(stub)(stub.status.set, 'status')}
          value={stub.status.value}
        />
      </div>

      <div>
        <label className="itemLabel" htmlFor="type">
          TYPE
        </label>
        <select id="type" value={stub.type.value} onChange={handle(stub)(stub.type.set, 'type')}>
          <option value="text/plain">text/plain</option>
          <option value="application/json">application/json</option>
          <option value="application/xml">application/xml</option>
        </select>
      </div>

      <div>
        <label className="itemLabel" htmlFor="body">
          BODY
        </label>
        <textarea
          id="body"
          className="responseBody"
          onChange={handle(stub)(stub.body.set, 'body')}
          rows="5"
          cols="33"
          value={stub.body.value}
        />
      </div>

      <SaveButton onSave={onSave} />
    </div>
  );
}
