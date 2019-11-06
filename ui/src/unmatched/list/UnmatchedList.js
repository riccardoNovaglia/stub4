import _ from 'lodash';
import React from 'react';

export function UnmatchedList({ unmatched, setStarter }) {
  return (
    <>
      <div className="unmatchedList">
        {_.isEmpty(unmatched) && <p className="noResultsMsg">No Unmatched yet</p>}
        {unmatched.map((unmatch, index) => (
          <div key={`${index}-unmatch`} className="unmatch">
            <UnmatchedListItem item={unmatch} setStarter={setStarter} />
          </div>
        ))}
      </div>
    </>
  );
}

function UnmatchedListItem({ item, setStarter }) {
  const setUnmatchedStarter = unmatch => () =>
    setStarter({
      type: 'unmatched',
      request: { url: unmatch.url, method: unmatch.method }
    });

  return (
    <p>
      <span className={`method ${item.method.toLowerCase()}`}>{item.method}</span>{' '}
      <span className="url">{item.url}</span>
      <span className="called">Called {item.called > 1 ? `${item.called} times` : 'once'}</span>
      <button className="stubUnmatchedBtn" onClick={setUnmatchedStarter(item)}>
        <i className="material-icons">playlist_add</i>Create Stub
      </button>
    </p>
  );
}
