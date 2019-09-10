import _ from 'lodash';
import React from 'react';

import './StubsList.scss';

export function StubsList({ stubs, selected, setSelected }) {
  return (
    <div className="stubsList">
      {_.isEmpty(stubs) && <p className="noStubsMsg">No stubs have been created yet</p>}
      {Object.keys(stubs).map(stubUrl => (
        <div key={`${stubUrl}-item`} className="stub" onClick={() => setSelected(stubs[stubUrl])}>
          <p
            className={selected && selected.request.url === stubUrl ? 'selectedStubDef' : 'stubDef'}
          >
            <span className="method">{stubs[stubUrl].request.method}</span>{' '}
            <span className="url">{stubs[stubUrl].request.url}</span>
            <span>→</span>
            <span className="contentType">{stubs[stubUrl].response.contentType}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
