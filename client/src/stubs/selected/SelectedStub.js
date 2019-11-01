import React, { useEffect, useState } from 'react';

import './SelectedStub.scss';

export function SelectedStub({ selectedStub, setStarter, client }) {
  const [interactions, setInteractions] = useState(undefined);

  useEffect(() => {
    client.fetchInteractions(selectedStub.urlMatcher.url, setInteractions);
    const interval = setInterval(
      () => client.fetchInteractions(selectedStub.urlMatcher.url, setInteractions),
      1000
    );
    return () => clearInterval(interval);
  }, [selectedStub.urlMatcher.url, interactions, client]);

  return (
    <>
      <div className="selectedStub">
        <div className={`method ${selectedStub.method.toLowerCase()}`}>{selectedStub.method}</div>
        <div className="url">{selectedStub.urlMatcher.url}</div>
        <div className="contentType">{selectedStub.response.response.contentType}</div>
        <div className="responseBody">
          <strong>Response body:</strong>
          <pre>{selectedStub.response.response.body}</pre>
          <button onClick={() => setStarter({ type: 'stub', stub: selectedStub })}>
            <i className="material-icons">code</i>Edit
          </button>
        </div>
        {interactions && <div className="callCount">Called {interactions} times</div>}
      </div>
    </>
  );
}
