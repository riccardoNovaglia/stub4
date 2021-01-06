import { useState } from 'react';
import { RequestMatcher } from '../prototypes/matching/RequestMatcher';
import { Editor } from '../prototypes/stubsComponents/Editor';

const { stubFor, stubs } = require('@stub4/client');

const defaults = {
  requestMatcher: { url: '' },
  response: {
    statusCode: 200,
    body: '{}',
    contentType: 'application/json'
  }
};

export function StubEditor({ onClose, onSaved, editedItem }) {
  const id = editedItem?.id;
  const [enabled, setEnabled] = useState(editedItem?.enabled ?? true);
  const [requestMatcher, setRequestMatcher] = useState({
    ...defaults.requestMatcher,
    ...editedItem?.requestMatcher
  });
  const [response, setResponse] = useState({
    ...defaults.response,
    ...editedItem?.response
  });

  async function onSave() {
    await stubFor({ id, requestMatcher, response });
    onSaved();
  }

  async function onDelete() {
    await stubs.deleteById(id);
    onClose();
  }

  return (
    <Editor
      enabled={enabled}
      setEnabled={setEnabled}
      toggleEnable={stubs.setEnabled}
      itemId={id}
      onSave={onSave}
      onDelete={onDelete}
      onClose={onClose}
      stubbingDefinition={{ requestMatcher, response }}
    >
      <RequestMatcher requestMatcher={requestMatcher} setRequestMatcher={setRequestMatcher} />

      <br />
      <h3>Response: </h3>
      <fieldset id="responseDefinition" className="responseDefinition">
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
          <label className="itemLabel" htmlFor="contentType">
            CONTENT TYPE
          </label>
          <select
            id="contentType"
            value={response.contentType}
            onChange={(event) => setResponse({ ...response, contentType: event.target.value })}
          >
            <option value="text/plain">text/plain</option>
            <option value="application/json">application/json</option>
            <option value="application/xml">application/xml</option>
          </select>
        </div>

        <div>
          <label className="itemLabel" htmlFor="body">
            RESPONSE BODY
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
      </fieldset>
    </Editor>
  );
}

function toStringIfObject(body) {
  return typeof body === 'object' ? JSON.stringify(body) : body;
}
