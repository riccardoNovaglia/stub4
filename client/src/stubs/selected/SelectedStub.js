import axios from 'axios';
import React, { useEffect, useState } from 'react';

import './SelectedStub.scss';

export function SelectedStub({ selectedStub, setStarter }) {
  const [interactions, setInteractions] = useState(undefined);
  const [countClass, setCountClass] = useState('flashing');

  useEffect(() => {
    fetchInteractions(selectedStub.request.url, setInteractions);
    const interval = setInterval(
      () => fetchInteractions(selectedStub.request.url, setInteractions),
      1000
    );
    return () => clearInterval(interval);
  }, [selectedStub.request.url, interactions]);

  useEffect(() => flashItem(setCountClass), [interactions]);

  return (
    <>
      <div className="selectedStub">
        <div>
          {selectedStub.request.method} {selectedStub.request.url}
        </div>
        <div>↓</div>
        <div>{selectedStub.response.contentType}</div>
        <div>{selectedStub.response.body}</div>
        <button
          className="newButton"
          onClick={() => setStarter({ type: 'stub', stub: selectedStub })}
        >
          Edit
        </button>
      </div>
      {interactions && <div className={countClass}>Called {interactions} times</div>}
    </>
  );
}

async function fetchInteractions(url, set) {
  const res = await axios.post('/stubs/count', { url });
  set(res.data.count);
}

function flashItem(setCountClass) {
  setCountClass('flash');
  setTimeout(() => {
    setCountClass('');
  }, 500);
}
