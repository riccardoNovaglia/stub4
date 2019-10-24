import React, { useEffect, useState } from 'react';

import './SelectedCrud.scss';

export function SelectedCrud({ selectedCrud, client }) {
  const [data, setData] = useState();

  useEffect(() => {
    client.fetchCrudData(selectedCrud.url, setData);
  }, [selectedCrud.url, setData, client]);

  if (!data) return null;

  return (
    <div className="selectedCrud">
      <p>
        <span className="length">{data.length}</span> items found in{' '}
        <span className="selectedUrl">{selectedCrud.url}</span>
      </p>
      <Contents
        crudUrl={selectedCrud.url}
        data={data}
        onUpdate={() => client.fetchCrudData(selectedCrud.url, setData)}
        client={client}
      />
    </div>
  );
}

function Contents({ crudUrl, data, onUpdate, client }) {
  const [editing, setEditing] = useState(false);
  const [crudContents, setCrudContents] = useState(() => JSON.stringify(data, null, 2));

  async function saveData() {
    await JSON.parse(crudContents).map(item => client.saveCrudData(crudUrl, item));
    setEditing(false);
    onUpdate();
  }

  return (
    <>
      <p className="contentsLabel">Contents:</p>
      <button onClick={() => setEditing(!editing)} className="editButton">
        Edit
      </button>
      {editing ? (
        <div>
          <button className="saveNewCrudContents" onClick={() => saveData()}>
            Save
          </button>
          <textarea
            wrap="off"
            cols="90"
            rows="30"
            value={crudContents}
            onChange={e => setCrudContents(e.target.value)}
            className="crudContentsEdit"
          />
        </div>
      ) : (
        <div className="crudContents">
          [
          {data.map((item, index) => (
            <pre key={`${index}-item`} className="crudItem">
              {JSON.stringify(item, null, 2)},
            </pre>
          ))}
          ]
        </div>
      )}
    </>
  );
}
