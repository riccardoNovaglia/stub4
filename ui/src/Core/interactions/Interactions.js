import React, { useEffect, useState } from 'react';

import { InteractionsList } from './InteractionsList';

import { getInteractions, clearInteractions } from '@stub4/client';

import './Interactions.scss';

export function Interactions({ children }) {
  const [socket, setSocket] = useState(null);
  const [previousInteractions, setPreviousInteractions] = useState([]);

  useEffect(() => {
    async function fetchInteractions() {
      const response = await getInteractions();
      const { interactions: previousInteractions, websocketPort } = response.data;
      setPreviousInteractions(previousInteractions);
      const socket = new WebSocket(`ws://localhost:${websocketPort}/interactions`);
      setSocket(socket);
    }
    if (socket === null) {
      fetchInteractions();
    }
  }, [socket]);

  async function clear() {
    await clearInteractions();
    setPreviousInteractions([]);
  }

  return (
    <div className="panel">
      <h1>
        Interactions<i className="material-icons">swap_horiz</i>
        {children}
        <button className="clearInteractions" onClick={clear}>
          <i className="material-icons">clear_all</i>Clear
        </button>
      </h1>
      {socket ? (
        <RealTimeInteractions socket={socket} previousInteractions={previousInteractions} />
      ) : (
        'Just a second'
      )}
    </div>
  );
}

function RealTimeInteractions({ socket, previousInteractions }) {
  const [interactions, setInteractions] = useState(previousInteractions);

  useEffect(() => {
    setInteractions(previousInteractions);
  }, [previousInteractions]);

  socket.onmessage = (message) => {
    const parsedItem = JSON.parse(message.data);
    setInteractions([...interactions, parsedItem]);
  };

  return <InteractionsList interactions={interactions} />;
}
