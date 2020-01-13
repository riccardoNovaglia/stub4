import React, { useEffect, useState } from 'react';

import { UnmatchedList } from './list/UnmatchedList';
import { UnmatchedToItem } from './UnmatchedToItem';

export function Unmatched({ client, clients, setTab }) {
  const [unmatched, setUnmatched] = useState([]);
  const [selected, setSelected] = useState();

  useEffect(() => {
    client.fetchUnmatched(setUnmatched);
    const interval = setInterval(() => client.fetchUnmatched(setUnmatched), 1000);
    return () => clearInterval(interval);
  }, [setUnmatched, client]);

  // TODO: why is this broken?
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
      <UnmatchedList unmatched={unmatched} setSelected={setSelected} />
      <UnmatchedToItem
        clients={clients}
        selected={selected}
        setSelected={setSelected}
        setTab={setTab}
      />
    </div>
  );
}
