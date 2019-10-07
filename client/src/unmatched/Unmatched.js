import React, { useEffect, useState } from 'react';

import Stub4 from '@stub4/stubClient';

import { UnmatchedList } from './list/UnmatchedList';

import './Unmatched.scss';

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
      <h1>Unmatched requests</h1>
      <button className="clearBtn" onClick={() => clear()}>
        CLEAR
      </button>
      <div className="unmatched">
        <UnmatchedList unmatched={unmatched} setStarter={setStarter} />
      </div>
    </div>
  );
}
