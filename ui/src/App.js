import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Stub4 from '@stub4/client';

import { Stubs } from './stubs/Stubs';
import { Scenarios } from './scenarios/Scenarios';
import { Cruds } from './cruds/Cruds';
import { Proxy } from './proxy/Proxy';
import { Contracts } from './contracts/Contracts';
import { Unmatched } from './unmatched/Unmatched';
import { New, useHooky } from './new/New';
import Tabs from './Tabs';

import './App.scss';
import './Lists.scss';

export default function App() {
  const [tab, setCurrentTab] = useState('stubs');

  const [building, setBuilding] = useState(false);
  const [starter, setStarter] = useState(undefined);

  const hooky = useHooky();

  const clients = useClients();

  const build = starter => {
    setBuilding(true);
    setStarter(starter);
    hooky.update(starter);
  };
  const doneBuilding = () => {
    setBuilding(false);
    setStarter(undefined);
    hooky.clear();
  };

  return (
    <>
      <New
        starter={starter}
        hooky={hooky}
        building={building}
        onBuilding={() => {
          setStarter(undefined);
          setBuilding(true);
        }}
        afterSuccessfulCreation={doneBuilding}
        onEscape={doneBuilding}
        clients={clients}
      />
      <Contracts />
      <div className="App">
        <div className="stubsAndCruds">
          <Tabs tab={tab} setCurrentTab={setCurrentTab} />
          {tab === 'stubs' && (
            <Stubs setStarter={build} client={clients.stubClient} onClear={() => {}} />
          )}
          {tab === 'scenarios' && (
            <Scenarios setStarter={build} client={clients.scenariosClient} onClear={() => {}} />
          )}
          {tab === 'cruds' && (
            <Cruds setStarter={build} client={clients.crudClient} onClear={() => {}} />
          )}
          {tab === 'proxy' && (
            <Proxy setStarter={build} client={clients.proxyClient} onClear={() => {}} />
          )}
        </div>
        <div className="unmatchedBody">
          <Unmatched setStarter={build} client={clients.unmatchedClient} />
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
