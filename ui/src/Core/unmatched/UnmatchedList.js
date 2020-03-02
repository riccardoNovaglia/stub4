import _ from 'lodash';
import React from 'react';

export function UnmatchedList({ unmatched, setSelected }) {
  return (
    <>
      <div className="unmatchedList">
        {_.isEmpty(unmatched) && <p className="noResultsMsg">No Unmatched yet</p>}
        {unmatched.map((unmatch, index) => (
          <div key={`${index}-unmatch`} className="unmatch">
            <UnmatchedListItem item={unmatch} setSelected={setSelected} />
          </div>
        ))}
      </div>
    </>
  );
}

function UnmatchedListItem({ item, setSelected }) {
  return (
    <p>
      <span className={`method ${item.method.toLowerCase()}`}>{item.method}</span>{' '}
      <span className="url">{item.url}</span>
      <span className="called">Called {item.called > 1 ? `${item.called} times` : 'once'}</span>
      <button className="stubUnmatchedBtn" onClick={() => setSelected(item)}>
        <i className="material-icons">playlist_add</i>Create Stub
      </button>
    </p>
  );
}
