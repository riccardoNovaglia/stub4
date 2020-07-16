import React, { useEffect, useState } from 'react';

import './SelectedCrud.scss';

export function SelectedCrud({ selected, client }) {
  return (
    <div className="selectedCrud">
      <Contents crudUrl={selected.url} client={client} />
    </div>
  );
}

function Contents({ crudUrl, client }) {
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(false);
  const [crudContents, setCrudContents] = useState({});

  useEffect(() => {
    function fetchData() {
      client.fetchCrudData(crudUrl, setData);
    }
    fetchData();
  }, [crudUrl, client, setData, editing]);

  useEffect(() => {
    setCrudContents(JSON.stringify(data, null, 2));
  }, [data]);

  async function saveData() {
    await JSON.parse(crudContents).map((item) => client.saveCrudData(crudUrl, item));
    setEditing(false);
  }

  return (
    <>
      <p className="contentsLabel">
        <span className="length">{data.length}</span> items found
      </p>
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
            onChange={(e) => setCrudContents(e.target.value)}
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
