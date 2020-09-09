import React, { useEffect, useState, useCallback } from 'react';

import { InteractionsList } from './InteractionsList';

import { getInteractions } from '@stub4/client';

import './Interactions.scss';

export function Interactions({ children }) {
  const [websocketPort, setWebsocketPort] = useState(-1);
  const [interactions, setInteractions] = useState([]);

  function startSocket(port, onInteraction) {
    const client = new WebSocket(`ws://localhost:${port}/interactions`);
    client.onmessage = (message) => {
      const parsedItem = JSON.parse(message.data);
      onInteraction(parsedItem);
    };
  }
  const websocketCallback = useCallback(startSocket, []);

  useEffect(() => {
    async function fetchInteractions() {
      const response = await getInteractions();
      const { interactions: allInteractions, websocketPort } = response.data;
      setInteractions(allInteractions);
      setWebsocketPort(websocketPort);
    }
    fetchInteractions();
  }, [setInteractions, setWebsocketPort]);

  useEffect(() => {
    if (websocketPort === -1) return;

    startSocket(websocketPort, (interaction) => setInteractions([...interactions, interaction]));
  }, [websocketPort, websocketCallback, interactions, setInteractions]);

  return (
    <div className="panel">
      <h1>
        Interactions<i className="material-icons">call_missed</i>
        {children}
      </h1>
      <InteractionsList interactions={interactions} />
    </div>
  );
}
