import _ from 'lodash';
import React from 'react';

export function UnmatchedList({ unmatched, setStarter }) {
  const setUnmatchedStarter = unmatch => () =>
    setStarter({
      type: 'unmatched',
      request: { url: unmatch.url, method: unmatch.method }
    });

  return (
    <div className="unmatchedList">
      {_.isEmpty(unmatched) && <p className="noResultsMsg">No Unmatched yet</p>}
      {unmatched.map((unmatch, index) => (
        <div key={`${index}-unmatch`} className="unmatch">
          <p>
            <span className={`method ${unmatch.method.toLowerCase()}`}>{unmatch.method}</span>{' '}
            <span className="url">{unmatch.url}</span>
            <span className="called">
              Called {unmatch.called > 1 ? `${unmatch.called} times` : 'once'}
            </span>
            <button className="stubUnmatchedBtn" onClick={setUnmatchedStarter(unmatch)}>
              <i className="material-icons">playlist_add</i>Create Stub
            </button>
          </p>
        </div>
      ))}
    </div>
  );
}
