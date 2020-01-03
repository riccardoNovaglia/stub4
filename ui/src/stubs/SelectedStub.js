import React, { useEffect, useState } from 'react';

import './Stub.scss';

export function SelectedStub({ selected, client, onEdit }) {
  const [interactions, setInteractions] = useState();
  const url = selected.urlMatcher.url;

  useEffect(() => {
    client.fetchInteractions(url, setInteractions);
    const interval = setInterval(() => client.fetchInteractions(url, setInteractions), 1000);
    return () => clearInterval(interval);
  }, [url, interactions, client]);

  return (
    <>
      <div className="selectedStub">
        <div className={`method ${selected.method.toLowerCase()}`}>{selected.method}</div>
        <div className="url">{selected.urlMatcher.url}</div>
        <div className="url">{JSON.stringify(selected.bodyMatcher)}</div>
        <div className="contentType">{selected.response.contentType}</div>
        <div className="responseBody">
          <strong>Response body:</strong>
          <pre>{JSON.stringify(selected.response.body)}</pre>
          <button onClick={() => onEdit(selected)}>
            <i className="material-icons">code</i>Edit
          </button>
        </div>
        <Interactions interactions={interactions} />
      </div>
    </>
  );
}

function Interactions({ interactions }) {
  return <>{interactions && <div className="callCount">Called {interactions} times</div>}</>;
}
