import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { UnmatchedList } from './list/UnmatchedList';

import './Unmatched.scss';

export function Unmatched() {
  const [unmatched, setUnmatched] = useState([]);

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
      <div className="unmatched">
        <UnmatchedList unmatched={unmatched} />
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
