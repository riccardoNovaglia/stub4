import _ from 'lodash';
import React from 'react';

import './UnmatchedList.scss';

export function UnmatchedList({ unmatched }) {
  return (
    <div className="UnmatchedList">
      {_.isEmpty(unmatched) && <p className="noUnmatchedMsg">No Unmatched yet</p>}
      {unmatched.map(unmatch => (
        <div key={`${unmatch.url}-item`} className="unmatch">
          <p className="unmatchedDef">
            <span className="method">{unmatch.method}</span>{' '}
            <span className="url">{unmatch.url}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
