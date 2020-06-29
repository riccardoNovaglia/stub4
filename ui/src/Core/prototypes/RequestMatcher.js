import React, { useState, useEffect } from 'react';

import { Url } from '../prototypes/Url';
import { handle, handleValue } from './NewItemManagement';

import './RequestMatcher.scss';

export function RequestMatcher({ item, children }) {
  return (
    <div className="requestMatching">
      <h3>Request Matching</h3>
      <Url url={item.url} handle={handleValue(item)(item.url.set, 'url')} />
      {children}
    </div>
  );
}

export function FullRequestMatcher({ item, bodyMatcher, setBodyMatcher }) {
  return (
    <RequestMatcher item={item}>
      <Method item={item} />
      <BodyMatcher bodyMatcher={bodyMatcher} setBodyMatcher={setBodyMatcher} />
    </RequestMatcher>
  );
}

export function Method({ item }) {
  return (
    <div>
      <label className="itemLabel" htmlFor="method">
        METHOD
      </label>
      <select
        id="method"
        value={item.method.value}
        onChange={handle(item)(item.method.set, 'method')}
      >
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PATCH">PATCH</option>
        <option value="DELETE">DELETE</option>
        <option value="*">* (Any)</option>
      </select>
    </div>
  );
}

export function BodyMatcher({ bodyMatcher, setBodyMatcher }) {
  const initialValue = bodyMatcher;
  const [withBodyMatch, setWithBodyMatch] = useState(bodyMatcher !== undefined);

  useEffect(() => {
    withBodyMatch
      ? setBodyMatcher(initialValue !== undefined ? initialValue : { body: '', type: 'json' })
      : setBodyMatcher(initialValue);
  }, [withBodyMatch, bodyMatcher, setBodyMatcher, initialValue]);

  return (
    <>
      <label className="itemLabel bodyMatchLabel" htmlFor="bodyMatchCheckbox">
        Body matching
      </label>
      <input
        id="bodyMatchCheckbox"
        type="checkbox"
        className="bodyMatchCheckbox"
        checked={withBodyMatch}
        onChange={(event) => {
          setWithBodyMatch(event.target.checked);
        }}
      />

      {withBodyMatch && (
        <div>
          <div>
            <label className="itemLabel" htmlFor="bodyType">
              BODY TYPE
            </label>
            <select
              id="bodyType"
              value={bodyMatcher?.type}
              onChange={(event) =>
                setBodyMatcher({
                  ...bodyMatcher,
                  type: event.target.value
                })
              }
            >
              <option value="json">JSON</option>
              <option value="xml">XML</option>
            </select>
          </div>

          <div>
            <label className="itemLabel" htmlFor="bodyMatch">
              BODY MATCHER
            </label>
            <textarea
              id="bodyMatch"
              value={bodyMatcher?.body}
              onChange={(event) =>
                setBodyMatcher({
                  ...bodyMatcher,
                  body: event.target.value
                })
              }
              rows="5"
              cols="33"
              className="bodyMatch"
            />
          </div>
        </div>
      )}
    </>
  );
}
