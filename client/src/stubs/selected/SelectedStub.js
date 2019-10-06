import axios from 'axios';
import React, { useEffect, useState } from 'react';

import './SelectedStub.scss';

export function SelectedStub({ selectedStub, setStarter }) {
  const [interactions, setInteractions] = useState(undefined);

  useEffect(() => {
    fetchInteractions(selectedStub.request.url, setInteractions);
    const interval = setInterval(
      () => fetchInteractions(selectedStub.request.url, setInteractions),
      1000
    );
    return () => clearInterval(interval);
  }, [selectedStub.request.url, interactions]);

  return (
    <>
      <div className="selectedStub">
        <div className={`method ${selectedStub.request.method}`}>{selectedStub.request.method}</div>
        <div>{selectedStub.request.url}</div>
        <div>↓</div>
        <div>{selectedStub.response.contentType}</div>
        <div>{selectedStub.response.body}</div>
        <button
          className="newButton"
          onClick={() => setStarter({ type: 'stub', stub: selectedStub })}
        >
          Edit
        </button>
        {interactions && <div className="callCount">Called {interactions} times</div>}
      </div>
    </>
  );
}

async function fetchInteractions(url, set) {
  const res = await axios.post('/stubs/count', { url });
  set(res.data.count);
}
