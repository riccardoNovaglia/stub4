import axios from 'axios';
import React, { useEffect, useState } from 'react';

import './SelectedDb.scss';

export function SelectedDb({ selectedDb }) {
  const [data, setData] = useState();

  useEffect(() => {
    fetchDbData(selectedDb.url, setData);
  }, [selectedDb.url, setData]);

  if (!data) return null;

  return (
    <div className="selectedDb">
      <p>
        <span className="length">{data.length}</span> items found in{' '}
        <span className="selectedUrl">{selectedDb.url}</span>
      </p>
      <Contents dbUrl={selectedDb.url} data={data} />
    </div>
  );
}

function Contents({ dbUrl, data }) {
  const [editing, setEditing] = useState(false);
  const [dbContents, setDbContents] = useState(() => JSON.stringify(data, null, 2));

  async function saveData() {
    await JSON.parse(dbContents).map(item => saveDbData(dbUrl, item));
    setEditing(false);
  }

  return (
    <>
      <p className="contentsLabel">Contents:</p>
      <button onClick={() => setEditing(!editing)} className="editButton">
        Edit
      </button>
      {editing ? (
        <>
          <button onClick={() => saveData()}>Save</button>
          <textarea
            value={dbContents}
            onChange={e => setDbContents(e.target.value)}
            className="dbContentsEdit"
          />
        </>
      ) : (
        <div className="dbContents">
          [
          {data.map((item, index) => (
            <pre key={`${index}-item`} className="dbItem">
              {JSON.stringify(item, null, 2)},
            </pre>
          ))}
          ]
        </div>
      )}
    </>
  );
}

export const fetchDbData = async (url, set) => {
  const res = await axios.get(url);
  set(res.data);
};

export const saveDbData = async (url, data) => {
  await axios.post(url, data);
};
