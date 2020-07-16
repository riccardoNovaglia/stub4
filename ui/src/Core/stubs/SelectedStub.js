import React from 'react';

import './Stub.scss';

export function SelectedStub({ selected, onEdit }) {
  // TODO: add interactions back in
  // const [interactions, setInteractions] = useState();
  // const url = selected.requestMatcher.url;

  // useEffect(() => {
  // client.fetchInteractions(url, setInteractions);
  // const interval = setInterval(() => client.fetchInteractions(url, setInteractions), 1000);
  // return () => clearInterval(interval);
  // }, [url, interactions, client]);

  return (
    <>
      <div className="selectedStub">
        <div className={`method ${selected.requestMatcher.method?.toLowerCase()}`}>
          {selected.requestMatcher.method}
        </div>
        <div className="url">{selected.requestMatcher.url}</div>
        <div className="url">{JSON.stringify(selected.bodyMatcher)}</div>
        <div className="contentType">{selected.response.contentType}</div>
        <div className="responseBody">
          <strong>Response body:</strong>
          <pre>{JSON.stringify(selected.response.body)}</pre>
          <button onClick={() => onEdit(selected)}>
            <i className="material-icons">code</i>Edit
          </button>
        </div>
        {/* <Interactions interactions={0} /> */}
      </div>
    </>
  );
}

// function Interactions({ interactions }) {
//   return <>{interactions && <div className="callCount">Called {interactions} times</div>}</>;
// }
