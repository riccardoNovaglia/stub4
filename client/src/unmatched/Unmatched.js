import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { UnmatchedList } from './list/UnmatchedList';

import './Unmatched.scss';
import NewStub from './newStub/NewStub';

export function Unmatched() {
  const [unmatched, setUnmatched] = useState([]);
  const [unmatchedSelected, setUnmatchedSelected] = useState(undefined);

  useEffect(() => {
    fetchUnmatched(setUnmatched);
    const interval = setInterval(() => fetchUnmatched(setUnmatched), 1000);
    return () => clearInterval(interval);
  }, [setUnmatched]);

  const clear = async () => {
    await clearUnmatched();
    await fetchUnmatched(setUnmatched);
  };

  return (
    <div>
      <h1 className="unmatchedTitle">Unmatched</h1>
      <button className="clearUnmatchedBtn" onClick={() => clear()}>
        CLEAR
      </button>
      {unmatchedSelected && (
        <NewStub
          url={unmatchedSelected.url}
          method={unmatchedSelected.method}
          afterSuccessfulCreation={() => {}}
        />
      )}
      <div className="unmatched">
        <UnmatchedList
          unmatched={unmatched}
          selected={unmatchedSelected}
          onUnmatchedSelected={selected => setUnmatchedSelected(selected)}
        />
      </div>
    </div>
  );
}

const fetchUnmatched = async set => {
  const res = await axios.get('/Unmatched');
  set(res.data);
};

const clearUnmatched = async () => {
  await axios.delete('/unmatched');
};
