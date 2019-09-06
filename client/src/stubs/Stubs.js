import _ from 'lodash';
import axios from 'axios';
import React, { useState } from 'react';

import './Stub.scss';

export function Stubs({ stubs }) {
  const [selected, setSelected] = useState();

  return (
    <div className="stubs">
      <div className="stubsList">
        {_.isEmpty(stubs) && <p className="noStubsMsg">No stubs have been created yet</p>}
        {Object.keys(stubs).map(stubUrl => (
          <div key={`${stubUrl}-item`} className="stub" onClick={() => setSelected(stubs[stubUrl])}>
            <p
              className={
                selected && selected.request.url === stubUrl ? 'selectedStubDef' : 'stubDef'
              }
            >
              <span className="method">{stubs[stubUrl].request.method}</span>{' '}
              <span className="url">{stubs[stubUrl].request.url}</span>
              <span>→</span>
              <span className="contentType">{stubs[stubUrl].response.contentType}</span>
            </p>
          </div>
        ))}
      </div>
      {selected && (
        <div className="selectedStub">
          <div>
            {selected.request.method} {selected.request.url}
          </div>
          <div>↓</div>
          <div>{selected.response.contentType}</div>
          <div>{selected.response.body}</div>
        </div>
      )}
    </div>
  );
}

export const fetchStubs = async set => {
  const res = await axios.get('/stubs');
  set(res.data);
};
