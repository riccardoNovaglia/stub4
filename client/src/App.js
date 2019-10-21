import React, { useState, useEffect } from 'react';

import { Stubs } from './stubs/Stubs';
import { Scenarios } from './scenarios/Scenarios';
import { Cruds } from './cruds/Cruds';
import { Proxy } from './proxy/Proxy';
import { Contracts } from './contracts/Contracts';
import { Unmatched } from './unmatched/Unmatched';
import { New, useHooky } from './new/New';
import Tabs from './Tabs';
import Stub4 from '@stub4/client';

import './App.scss';
import './Lists.scss';

const stubClient = new Stub4.StubClient();
const crudClient = new Stub4.CrudClient();
const proxyClient = new Stub4.ProxyClient();
const scenariosClient = new Stub4.ScenariosClient();

export default function App() {
  const [tab, setCurrentTab] = useState('stubs');

  const [building, setBuilding] = useState(false);
  const [starter, setStarter] = useState(undefined);

  const [stubs, setStubs] = useState([]);
  useEffect(() => {
    stubClient.fetchStubs(setStubs);
  }, [setStubs]);

  const [cruds, setCruds] = useState({});
  useEffect(() => {
    crudClient.fetchCruds(setCruds);
  }, [setCruds]);

  const [proxy, setProxy] = useState([]);
  useEffect(() => {
    proxyClient.fetchProxy(setProxy);
  }, [setProxy]);

  const [scenarios, setScenarios] = useState([]);
  useEffect(() => {
    scenariosClient.fetchScenarios(setScenarios);
  }, [setScenarios]);

  const hooky = useHooky();

  const build = starter => {
    setBuilding(true);
    setStarter(starter);
    hooky.update(starter);
  };
  const doneBuilding = () => {
    stubClient.fetchStubs(setStubs);
    crudClient.fetchCruds(setCruds);
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
      />
      <Contracts />
      <div className="App">
        <div className="stubsAndCruds">
          <Tabs tab={tab} setCurrentTab={setCurrentTab} />
          {tab === 'stubs' && (
            <Stubs stubs={stubs} setStarter={build} onClear={() => setStubs({})} />
          )}
          {tab === 'scenarios' && (
            <Scenarios scenarios={scenarios} setStarter={build} onClear={() => setScenarios({})} />
          )}
          {tab === 'cruds' && (
            <Cruds cruds={cruds} setStarter={build} onClear={() => setCruds({})} />
          )}
          {tab === 'proxy' && (
            <Proxy proxy={proxy} setStarter={build} onClear={() => setProxy({})} />
          )}
        </div>
        <div className="unmatchedBody">
          <Unmatched setStarter={build} />
        </div>
      </div>
    </>
  );
}
