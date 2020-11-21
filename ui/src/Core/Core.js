import axios from 'axios';
import { useEffect, useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Stub4, { setPort as setStubClientPort } from '@stub4/client';

import { Stubs } from './stubs/Stubs';
import { Cruds } from './cruds/Cruds';
import { Scenarios } from './scenarios/Scenarios';
import { Proxy } from './proxy/Proxys';
import { Interactions } from './interactions/Interactions';

import Tabs from './navigation/Tabs';

import './Core.scss';

export default function Core({ children }) {
  const { clients, pending } = useClients();
  const [interactions, setInteractions] = useState(true);

  if (pending) {
    return (
      <>
        {children}
        <h2 className="loading">Just a second</h2>
      </>
    );
  }

  return (
    <div className="Core">
      {children}
      <div className="tabs">
        <Tabs>
          {!interactions && (
            <button className="showSidePanel" onClick={() => setInteractions(true)}>
              Show interactions
            </button>
          )}
        </Tabs>
      </div>
      <div className="panels">
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
        {interactions && (
          <div className="sidePanel">
            <Interactions>
              <button className="hideSidePanel" onClick={() => setInteractions(false)}>
                Hide
              </button>
            </Interactions>
          </div>
        )}
      </div>
    </div>
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
      contractClient: new Stub4.ContractsClient(port)
    }
  };
};
