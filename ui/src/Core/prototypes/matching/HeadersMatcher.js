import { useState, useEffect } from 'react';

export function HeadersMatcher({ headersMatcher, onChange }) {
  const [headersMatcherDefined, setHeadersMatcherDefined] = useState(
    headersMatcher !== undefined && headersMatcher !== {}
  );
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!adding && empty(headersMatcher)) {
      setHeadersMatcherDefined(false);
    }
  }, [adding, headersMatcher, setHeadersMatcherDefined]);

  return (
    <>
      <label className="itemLabel" htmlFor="headersMatcher">
        HEADERS MATCHER
      </label>
      <input
        id="headersMatcher"
        type="checkbox"
        checked={headersMatcherDefined}
        onChange={(event) => {
          setAdding(event.target.checked);
          setHeadersMatcherDefined(event.target.checked);
        }}
      />

      {headersMatcherDefined && (
        <>
          <ExistingHeaders
            headersMatcher={headersMatcher}
            setHeadersMatcherDefined={setHeadersMatcherDefined}
            onChange={onChange}
          />
          <NewHeader
            headersMatcher={headersMatcher}
            adding={adding}
            setAdding={setAdding}
            onChange={onChange}
          />
          <button id="headersMatcher" onClick={() => setAdding(true)}>
            Add
          </button>
        </>
      )}
    </>
  );
}

function ExistingHeaders({ headersMatcher, setHeadersMatcherDefined, onChange }) {
  const keys = headersMatcher !== undefined ? Object.keys(headersMatcher) : [];
  return keys.map((key, index) => (
    <div key={`${key}-${index}`}>
      <label>
        Name
        <input type="text" value={key} disabled />
      </label>
      <label>
        Value
        <input type="text" value={headersMatcher[key]} disabled />
      </label>
      <button
        id="removeButton"
        onClick={() => {
          const copy = headersMatcher;
          delete copy[key];
          if (empty(copy)) {
            setHeadersMatcherDefined(false);
          }
          onChange(copy);
        }}
      >
        Remove
      </button>
    </div>
  ));
}

function NewHeader({ headersMatcher, onChange, adding, setAdding }) {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  if (!adding) return null;

  return (
    <div>
      <label>
        Name
        <input type="text" onChange={(event) => setNewKey(event.target.value)} value={newKey} />
      </label>
      <label htmlFor="newValue">Value</label>
      <input
        id="newValue"
        type="text"
        onChange={(event) => setNewValue(event.target.value)}
        value={newValue}
      />
      <button
        id="confirmButton"
        onClick={() => {
          onChange({ ...headersMatcher, [newKey]: newValue });
          setAdding(false);
          setNewKey('');
          setNewValue('');
        }}
      >
        Confirm
      </button>
      <button id="cancelButton" onClick={() => setAdding(false)}>
        Cancel
      </button>
    </div>
  );
}

function empty(item) {
  return item === undefined || Object.keys(item).length === 0;
}
