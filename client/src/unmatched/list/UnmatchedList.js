import _ from 'lodash';
import React from 'react';

import './UnmatchedList.scss';

export function UnmatchedList({ unmatched, setStarter }) {
  const setUnmatchedStarter = unmatch => () =>
    setStarter({
      type: 'unmatched',
      request: { url: unmatch.url, method: unmatch.method }
    });

  return (
    <div className="unmatchedList">
      {_.isEmpty(unmatched) && <p className="noUnmatchedMsg">No Unmatched yet</p>}
      {unmatched.map((unmatch, index) => (
        <div key={`${index}-unmatch`} className="unmatch">
          <p className={'unmatchDef'}>
            <span className="method">{unmatch.method}</span>{' '}
            <span className="url">{unmatch.url}</span>
            <button className="stubUnmatchedBtn" onClick={setUnmatchedStarter(unmatch)}>
              Stub
            </button>
          </p>
        </div>
      ))}
    </div>
  );
}
