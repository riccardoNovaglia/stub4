import React, { useEffect, useState } from 'react';
import Stub4 from '@stub4/stubClient';

import './SelectedStub.scss';

const stubClient = new Stub4.StubClient();

export function SelectedStub({ selectedStub, setStarter }) {
  const [interactions, setInteractions] = useState(undefined);

  useEffect(() => {
    stubClient.fetchInteractions(selectedStub.request.url, setInteractions);
    const interval = setInterval(
      () => stubClient.fetchInteractions(selectedStub.request.url, setInteractions),
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
