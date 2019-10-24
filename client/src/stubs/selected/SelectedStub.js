import React, { useEffect, useState } from 'react';

import './SelectedStub.scss';

export function SelectedStub({ selectedStub, setStarter, client }) {
  const [interactions, setInteractions] = useState(undefined);

  useEffect(() => {
    client.fetchInteractions(selectedStub.request.url, setInteractions);
    const interval = setInterval(
      () => client.fetchInteractions(selectedStub.request.url, setInteractions),
      1000
    );
    return () => clearInterval(interval);
  }, [selectedStub.request.url, interactions, client]);

  return (
    <>
      <div className="selectedStub">
        <div className={`method ${selectedStub.request.method.toLowerCase()}`}>
          {selectedStub.request.method}
        </div>
        <div className="url">{selectedStub.request.url}</div>
        <div className="contentType">{selectedStub.response.contentType}</div>
        <div className="responseBody">
          <strong>Response body:</strong>
          <pre>{selectedStub.response.body}</pre>
          <button onClick={() => setStarter({ type: 'stub', stub: selectedStub })}>
            <i className="material-icons">code</i>Edit
          </button>
        </div>
        {interactions && <div className="callCount">Called {interactions} times</div>}
      </div>
    </>
  );
}
