import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Stub4, { setPort as setStubClientPort } from '@stub4/client';

import { Stubs } from './stubs/Stubs';
import { Cruds } from './cruds/Cruds';
import { Scenarios } from './scenarios/Scenarios';
import { Proxy } from './proxy/Proxy';
import { Unmatched } from './unmatched/Unmatched';

import Tabs from './navigation/Tabs';

import './Core.scss';

function Core({ children }) {
  const clients = useClients();

  return (
    <>
      <div className="header">
        <h1 className="welcome">Welcome to Stub4!</h1>
        {/* <Contracts /> TODO: add back, but possibly better. Or at least toggle */}
        {children}
      </div>
      <div className="App">
        <div className="stubsAndCruds">
          <Tabs />
          <Switch>
            <Route path="/stubs">
              <Stubs client={clients.stubClient} />
            </Route>
            <Route path="/scenarios">
              <Scenarios client={clients.scenariosClient} />
            </Route>
            <Route path="/cruds">
              <Cruds client={clients.crudClient} />
            </Route>
            <Route path="/proxy">
              <Proxy client={clients.proxyClient} />
            </Route>
            <Redirect to="/stubs" />
          </Switch>
        </div>
        <div className="unmatchedBody">
          <Unmatched client={clients.unmatchedClient} clients={clients} />
        </div>
      </div>
    </>
  );
}

const useClients = () => {
  const [port, setPort] = useState(8080);
  setStubClientPort(8080);

  useEffect(() => {
    const fetchPort = async () => {
      const ax = axios.create();
      const response = await ax.get('/stubs-port');
      setPort(response.data.port);
      setStubClientPort(response.data.port);
    };

    fetchPort();
  });

  return {
    stubClient: new Stub4.StubClient(port),
    crudClient: new Stub4.CrudClient(port),
    scenariosClient: new Stub4.ScenariosClient(port),
    proxyClient: new Stub4.ProxyClient(port),
    unmatchedClient: new Stub4.UnmatchedClient(port),
    contractClient: new Stub4.ContractsClient(port)
  };
};

export { Core };
