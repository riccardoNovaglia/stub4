import React, { useState } from 'react';
import { isEmpty } from 'lodash';

import { useObject, updatableItem, handle } from '../prototypes/NewItemManagement';
import { FullRequestMatcher } from '../prototypes/RequestMatcher';
import { SaveButton } from '../prototypes/SaveButton';

const { stubFor } = require('@stub4/client');

const asStringIfObject = item => (typeof item === 'object' ? JSON.stringify(item) : item);
const asObjectIfString = item => (typeof item === 'string' ? JSON.parse(item) : item);

export function NewStub({ onClose, onSaved, editedItem }) {
  const defaults = {
    requestMatcher: {
      urlMatcher: { url: '' },
      method: 'GET',
      bodyMatcher: { body: undefined, type: undefined }
    },
    response: {
      statusCode: 200,
      body: '{}',
      contentType: 'application/json'
    },
    ...editedItem
  };

  const stub = updatableItem({
    ...useObject('url', defaults.requestMatcher.urlMatcher.url),
    ...useObject('method', defaults.requestMatcher.method),
    ...useObject('status', defaults.response.statusCode),
    ...useObject('body', asStringIfObject(defaults.response.body)),
    ...useObject('type', defaults.response.contentType)
  });

  function getBodyMatcherValue(item) {
    return isEmpty(item?.requestMatcher.bodyMatcher)
      ? undefined
      : {
          body: JSON.stringify(item.requestMatcher.bodyMatcher.body),
          type: item.requestMatcher.bodyMatcher.type
        };
  }

  const [bodyMatcher, setBodyMatcher] = useState(getBodyMatcherValue(editedItem));

  async function onSave() {
    await stubFor({
      requestMatcher: {
        url: stub.url.value,
        method: stub.method.value,
        bodyMatcher: { body: asObjectIfString(bodyMatcher?.body), type: bodyMatcher?.type }
      },
      response: {
        statusCode: stub.status.value,
        type: stub.type.value,
        body: stub.body.value
      }
    });
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
