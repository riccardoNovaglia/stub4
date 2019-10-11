import React, { useEffect, useState } from 'react';

import Stub4 from '@stub4/client';

import { UnmatchedList } from './list/UnmatchedList';

const unmatchedClient = new Stub4.UnmatchedClient();

export function Unmatched({ setStarter }) {
  const [unmatched, setUnmatched] = useState([]);

  useEffect(() => {
    unmatchedClient.fetchUnmatched(setUnmatched);
    const interval = setInterval(() => unmatchedClient.fetchUnmatched(setUnmatched), 1000);
    return () => clearInterval(interval);
  }, [setUnmatched]);

  const clear = async () => {
    await unmatchedClient.clearUnmatched();
    await unmatchedClient.fetchUnmatched(setUnmatched);
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
