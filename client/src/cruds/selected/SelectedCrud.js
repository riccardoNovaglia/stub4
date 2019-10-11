import React, { useEffect, useState } from 'react';

import Stub4 from '@stub4/client';

import './SelectedCrud.scss';
const crudClient = new Stub4.CrudClient();

export function SelectedCrud({ selectedCrud }) {
  const [data, setData] = useState();

  useEffect(() => {
    crudClient.fetchCrudData(selectedCrud.url, setData);
  }, [selectedCrud.url, setData]);

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
        onUpdate={() => crudClient.fetchCrudData(selectedCrud.url, setData)}
      />
    </div>
  );
}

function Contents({ crudUrl, data, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [crudContents, setCrudContents] = useState(() => JSON.stringify(data, null, 2));

  async function saveData() {
    await JSON.parse(crudContents).map(item => crudClient.saveCrudData(crudUrl, item));
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
