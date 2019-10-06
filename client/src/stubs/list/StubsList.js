import _ from 'lodash';
import React from 'react';

import './StubsList.scss';

export function StubsList({ stubs, selected, setSelected }) {
  return (
    <div className="stubsList">
      {_.isEmpty(stubs) && <p className="noStubsMsg">No stubs have been created yet</p>}
      {stubs.map(stub => (
        <div
          key={`${stub.request.url}-item`}
          className={
            selected && selected.request.url === stub.request.url ? 'stub selected' : 'stub'
          }
          onClick={() => setSelected(stub)}
        >
          <p>
            <span className={`method ${stub.request.method}`}>{stub.request.method}</span>{' '}
            <span className="url">{stub.request.url}</span>
            <span>→</span>
            <span className="contentType">{stub.response.contentType}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
