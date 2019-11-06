import React, { useEffect, useState } from 'react';

import { UnmatchedList } from './list/UnmatchedList';

export function Unmatched({ setStarter, client }) {
  const [unmatched, setUnmatched] = useState([]);

  useEffect(() => {
    client.fetchUnmatched(setUnmatched);
    const interval = setInterval(() => client.fetchUnmatched(setUnmatched), 1000);
    return () => clearInterval(interval);
  }, [setUnmatched, client]);

  const clear = async () => {
    await client.clearUnmatched();
    await client.fetchUnmatched(setUnmatched);
  };

  return (
    <div className="panel unmatched">
      <h1>
        Unmatched requests<i className="material-icons">call_missed</i>
      </h1>
      <button className="clearBtn" onClick={() => clear()}>
        <i className="material-icons">clear_all</i>Clear
      </button>
      <div className="unmatched">
        <UnmatchedList unmatched={unmatched} setStarter={setStarter} />
      </div>
    </div>
  );
}
