import axios from 'axios';
import React from 'react';

import './Stub.scss';

export function Stubs({ stubs }) {
  return (
    <div>
      {Object.keys(stubs).map(stub => (
        <div key={`${stub}-fragment`} className="stub">
          <p>METHOD: {stubs[stub].request.method}</p>
          <p>URL: {stubs[stub].request.url}</p>
          <p>CONTENT-TYPE: {stubs[stub].response.contentType}</p>
          <p>BODY: {stubs[stub].response.body}</p>
        </div>
      ))}
    </div>
  );
}

export const fetchStubs = async set => {
  const res = await axios.get('/stubs');
  set(res.data);
};
