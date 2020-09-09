import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Stub4, { setPort as setStubClientPort } from '@stub4/client';

import { Stubs } from './stubs/Stubs';
import { Cruds } from './cruds/Cruds';
import { Scenarios } from './scenarios/Scenarios';
import { Proxy } from './proxy/Proxy';
import { Unmatched } from './unmatched/Unmatched';
// import { Interactions } from './interactions/Interactions';

import Tabs from './navigation/Tabs';

import './Core.scss';

function Core({ children }) {
  const { clients, pending } = useClients();
  const [unmatched, setUnmatched] = useState(false);

  if (pending) {
    return (
      <div className="header">
        <h1 className="welcome">Just a second...</h1>
      </div>
    );
  }

  return (
    <>
      <div className="header">
        <h1 className="welcome">Welcome to Stub4!</h1>
        {/* <Contracts /> TODO: add back, but possibly better. Or at least toggle */}
        {children}
      </div>
      <div className="App">
        <div className="tabs">
          <Tabs />
          {!unmatched && (
            <button className="showUnmatched" onClick={() => setUnmatched(true)}>
              Show unmatched
            </button>
          )}
        </div>
        <div className="stubsAndUnmatched">
          <div className="stubs">
            <Switch>
              <Route path="/stub4/stubs">
                <Stubs client={clients.stubClient} />
              </Route>
              <Route path="/stub4/scenarios">
                <Scenarios client={clients.scenariosClient} />
              </Route>
              <Route path="/stub4/cruds">
                <Cruds client={clients.crudClient} />
              </Route>
              <Route path="/stub4/proxy">
                <Proxy client={clients.proxyClient} />
              </Route>
              <Redirect to="/stub4/stubs" />
            </Switch>
          </div>
          {unmatched && (
            <div className="unmatchedBody">
              <Unmatched client={clients.unmatchedClient} clients={clients}>
                <button className="hideUnmatched" onClick={() => setUnmatched(false)}>
                  Hide
                </button>
              </Unmatched>
            </div>
          )}
          {/* <div className="unmatchedBody">
            <Interactions>
              <button className="hideUnmatched" onClick={() => setUnmatched(false)}>
                Hide
              </button>
            </Interactions>
          </div> */}
        </div>
      </div>
    </>
  );
}

const useClients = () => {
  const [port, setPort] = useState(8080);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    const fetchPort = async () => {
      const ax = axios.create();
      const response = await ax.get('/stubs-port');
      setPort(response.data.port);
      setStubClientPort(response.data.port);
      setPending(false);
    };

    fetchPort();
  });

  // TODO: these gotta go. Should just setPort above, and then use stubFor(matcher, response)
  // TWIST! How to list things and get existing? Need getStubs/getStub/clear type methods?
  return {
    pending,
    clients: {
      stubClient: new Stub4.StubClient(port),
      crudClient: new Stub4.CrudClient(port),
      scenariosClient: new Stub4.ScenariosClient(port),
      proxyClient: new Stub4.ProxyClient(port),
      unmatchedClient: new Stub4.UnmatchedClient(port),
      contractClient: new Stub4.ContractsClient(port)
    }
  };
};

export { Core };
