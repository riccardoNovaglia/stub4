import React, { useState } from 'react';
// import { useRouteMatch } from 'react-router-dom';
import { RequestMatcher } from '../prototypes/matching/RequestMatcher';
// import { SaveButton } from '../prototypes/scenariosComponents/SaveButton';

// const { stubFor } = require('@stub4/client');

const defaults = {
  requestMatcher: { url: '' }
};

export function ScenarioEditor({ onClose, editedItem }) {
  // const routeMatch = useRouteMatch();
  const [requestMatcher, setRequestMatcher] = useState({
    ...defaults.requestMatcher,
    ...editedItem?.requestMatcher
  });

  // async function onSave() {}

  return (
    <div onKeyDown={(e) => e.keyCode === 27 && onClose()}>
      <RequestMatcher requestMatcher={requestMatcher} setRequestMatcher={setRequestMatcher} />

      <br />

      <p>Bear with... work in progress.. but here's the definition?</p>

      <pre>{JSON.stringify(editedItem?.scenarios, null, 2)}</pre>

      {/* <SaveButton onSave={onSave} /> */}
      {/* TODO: add delete */}
    </div>
  );
}

// function toStringIfObject(body) {
//   return typeof body === 'object' ? JSON.stringify(body) : body;
// }
