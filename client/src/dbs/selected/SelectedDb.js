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
      <p>Contents:</p>
      <div className="dbContents">
        [
        {data.map(item => (
          <pre className="dbItem">{JSON.stringify(item, null, 2)},</pre>
        ))}
        ]
      </div>
    </div>
  );
}

export const fetchDbData = async (url, set) => {
  const res = await axios.get(url);
  set(res.data);
};
