import React, { useEffect, useState } from 'react';

import './SelectedStub.scss';

export function SelectedStub({ selected, setStarter, client }) {
  return (
    <>
      <div className="selectedStub">
        <div className={`method ${selected.method.toLowerCase()}`}>{selected.method}</div>
        <div className="url">{selected.urlMatcher.url}</div>
        <div className="contentType">{selected.response.contentType}</div>
        <div className="responseBody">
          <strong>Response body:</strong>
          <pre>{selected.response.body}</pre>
          <button onClick={() => setStarter({ type: 'stub', stub: selected })}>
            <i className="material-icons">code</i>Edit
          </button>
        </div>
        <Interactions url={selected.urlMatcher.url} client={client} />
      </div>
    </>
  );
}

function Interactions({ url, client }) {
  const [interactions, setInteractions] = useState();

  useEffect(() => {
    client.fetchInteractions(url, setInteractions);
    const interval = setInterval(() => client.fetchInteractions(url, setInteractions), 1000);
    return () => clearInterval(interval);
  }, [url, interactions, client]);

  return <>{interactions && <div className="callCount">Called {interactions} times</div>}</>;
}