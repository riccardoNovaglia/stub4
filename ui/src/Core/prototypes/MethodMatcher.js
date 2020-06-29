import React, { useState, useEffect } from 'react';

export function MethodMatcher({ methodMatcher, onChange }) {
  const [methodMatcherDefined, setMethodMatcherDefined] = useState(methodMatcher !== undefined);

  useEffect(() => {
    setMethodMatcherDefined(methodMatcher !== undefined);
  }, [methodMatcher, setMethodMatcherDefined]);

  return (
    <>
      <label className="itemLabel" htmlFor="methodMatcher">
        METHOD MATCHER
      </label>
      <input
        id="methodMatcher"
        type="checkbox"
        checked={methodMatcherDefined}
        onChange={(event) => onChange(event.target.checked ? 'GET' : undefined)}
      />
      {methodMatcherDefined && Methods(methodMatcher, onChange)}
    </>
  );
}

function Methods(methodMatcher, onChange) {
  return (
    <>
      <label className="itemLabel" htmlFor="method">
        METHOD
      </label>
      <select id="method" value={methodMatcher} onChange={(event) => onChange(event.target.value)}>
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PATCH">PATCH</option>
        <option value="DELETE">DELETE</option>
        <option value="*">* (Any)</option>
      </select>
    </>
  );
}
