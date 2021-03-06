import { useState, useEffect } from 'react';

export function BodyMatcher({ bodyMatcher, onChange }) {
  const [bodyMatcherDefined, setBodyMatcherDefined] = useState(!empty(bodyMatcher));

  useEffect(() => {
    setBodyMatcherDefined(!empty(bodyMatcher));
  }, [bodyMatcher, setBodyMatcherDefined]);

  return (
    <>
      <label className="itemLabel" htmlFor="bodyMatcher">
        BODY MATCHER
      </label>
      <input
        id="bodyMatcher"
        type="checkbox"
        checked={bodyMatcherDefined}
        onChange={(event) => {
          setBodyMatcherDefined(event.target.checked);
          onChange(
            event.target.checked
              ? {
                  type: 'json',
                  value: ''
                }
              : undefined
          );
        }}
      />
      {bodyMatcherDefined && <BodyMatcherDetails bodyMatcher={bodyMatcher} onChange={onChange} />}
    </>
  );
}

function BodyMatcherDetails({ bodyMatcher, onChange }) {
  return (
    <div>
      <div>
        <label className="itemLabel" htmlFor="bodyType">
          TYPE
        </label>
        <select
          id="bodyType"
          value={bodyMatcher?.type}
          onChange={(event) => {
            onChange({
              ...bodyMatcher,
              type: event.target.value
            });
          }}
        >
          <option value="json">JSON</option>
          <option value="xml">XML</option>
        </select>
      </div>

      <div>
        <label className="itemLabel" htmlFor="bodyMatch">
          MATCH
        </label>
        <textarea
          id="bodyMatch"
          value={toStringIfObject(bodyMatcher?.value)}
          onChange={(event) =>
            onChange({
              ...bodyMatcher,
              value: toJsonIfObject(event.target.value)
            })
          }
          rows="5"
          cols="33"
          className="bodyMatch"
        />
      </div>
    </div>
  );
}

function empty(item) {
  return item === undefined || Object.keys(item).length === 0;
}

function toStringIfObject(body) {
  return typeof body === 'object' ? JSON.stringify(body) : body;
}

function toJsonIfObject(body) {
  try {
    return JSON.parse(body);
  } catch (e) {
    return body;
  }
}
