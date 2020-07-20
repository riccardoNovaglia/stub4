import React, { useState } from 'react';
import { RequestMatcher } from '../prototypes/matching/RequestMatcher';
import { SaveButton } from '../prototypes/stubsComponents/SaveButton';

const { stubFor } = require('@stub4/client');

const defaults = {
  requestMatcher: { url: '' },
  response: {
    statusCode: 200,
    body: '{}',
    type: 'application/json'
  }
};

export function NewStub({ onClose, onSaved, editedItem }) {
  const [requestMatcher, setRequestMatcher] = useState({
    ...defaults.requestMatcher,
    ...editedItem?.requestMatcher
  });
  const [response, setResponse] = useState({
    ...defaults.response,
    ...editedItem?.response
  });

  async function onSave() {
    await stubFor({
      requestMatcher,
      response
    });
    onSaved();
  }

  return (
    <div onKeyDown={(e) => e.keyCode === 27 && onClose()}>
      <RequestMatcher requestMatcher={requestMatcher} setRequestMatcher={setRequestMatcher} />

      <br />
      <label htmlFor="responseDefinitionForm">Response: </label>
      <form
        id="responseDefinitionForm"
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
        }}
      >
        <div>
          <label className="itemLabel" htmlFor="status">
            STATUS
          </label>
          <input
            id="status"
            type="text"
            onChange={(event) => setResponse({ ...response, statusCode: event.target.value })}
            value={response.statusCode}
          />
        </div>

        <div>
          <label className="itemLabel" htmlFor="type">
            TYPE
          </label>
          <select
            id="type"
            value={response.type}
            onChange={(event) => setResponse({ ...response, type: event.target.value })}
          >
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
            onChange={(event) => setResponse({ ...response, body: event.target.value })}
            rows="5"
            cols="33"
            value={toStringIfObject(response.body)}
          />
        </div>
      </form>

      <SaveButton onSave={onSave} />
    </div>
  );
}

function toStringIfObject(body) {
  return typeof body === 'object' ? JSON.stringify(body) : body;
}
