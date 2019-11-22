import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Stub4 from '@stub4/client';

import { Stubs } from './stubs/Stubs';
import { Scenarios } from './scenarios/Scenarios';
import { Cruds } from './cruds/Cruds';
import { Proxy } from './proxy/Proxy';
import { Contracts } from './contracts/Contracts';
import { Unmatched } from './unmatched/Unmatched';

import Tabs from './Tabs';

import './App.scss';
import './Lists.scss';

export default function App() {
  const [tab, setCurrentTab] = useState('stubs');

  const clients = useClients();

  return (
    <>
      <Contracts />
      <div className="App">
        <div className="stubsAndCruds">
          <Tabs tab={tab} setCurrentTab={setCurrentTab} />
          {tab === 'stubs' && <Stubs client={clients.stubClient} />}
          {tab === 'scenarios' && <Scenarios client={clients.scenariosClient} />}
          {tab === 'cruds' && <Cruds client={clients.crudClient} />}
          {tab === 'proxy' && <Proxy client={clients.proxyClient} />}
        </div>
        <div className="unmatchedBody">
          <Unmatched client={clients.unmatchedClient} />
        </div>
      </div>
    </>
  );
}

const useClients = () => {
  const [port, setPort] = useState(8080);

  useEffect(() => {
    const fetchPort = async () => {
      const ax = axios.create();
      const response = await ax.get('/stubs-port');
      setPort(response.data.port);
    };

    fetchPort();
  }, [port, setPort]);

  return {
    stubClient: new Stub4.StubClient(port),
    crudClient: new Stub4.CrudClient(port),
    scenariosClient: new Stub4.ScenariosClient(port),
    proxyClient: new Stub4.ProxyClient(port),
    unmatchedClient: new Stub4.UnmatchedClient(port),
    contractClient: new Stub4.ContractsClient(port)
  };
};
