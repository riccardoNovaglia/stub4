import _ from 'lodash';
import React from 'react';

import './UnmatchedList.scss';

export function UnmatchedList({ unmatched, selected, onUnmatchedSelected }) {
  return (
    <div className="unmatchedList">
      {_.isEmpty(unmatched) && <p className="noUnmatchedMsg">No Unmatched yet</p>}
      {unmatched.map((unmatch, index) => (
        <div
          key={`${index}-unmatch`}
          className="unmatch"
          onClick={() => onUnmatchedSelected(unmatch)}
        >
          <p
            className={
              selected && selected.url === unmatch.url ? 'selectedUnmatchDef' : 'unmatchDef'
            }
          >
            <span className="method">{unmatch.method}</span>{' '}
            <span className="url">{unmatch.url}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
