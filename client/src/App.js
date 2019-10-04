import axios from 'axios';
import React, { useState, useEffect } from 'react';

import { Stubs } from './stubs/Stubs';
import { Cruds } from './cruds/Cruds';
import { Proxy } from './proxy/Proxy';
import { Contracts } from './contracts/Contracts';
import { Unmatched } from './unmatched/Unmatched';
import { New, useHooky } from './new/New';

import './App.scss';

export default function App() {
  const [tab, setCurrentTab] = useState('stubs');

  const [building, setBuilding] = useState(false);
  const [starter, setStarter] = useState(undefined);

  const [stubs, setStubs] = useState([]);
  useEffect(() => {
    fetchStubs(setStubs);
  }, [setStubs]);

  const [cruds, setCruds] = useState({});
  useEffect(() => {
    fetchCruds(setCruds);
  }, [setCruds]);

  const [proxy, setProxy] = useState([]);
  useEffect(() => {
    fetchProxy(setProxy);
  }, [setProxy]);

  const hooky = useHooky();

  const build = starter => {
    setBuilding(true);
    setStarter(starter);
    hooky.update(starter);
  };
  const doneBuilding = () => {
    fetchStubs(setStubs);
    fetchCruds(setCruds);
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
          <ul className="tabrow">
            <li
              onClick={() => setCurrentTab('stubs')}
              className={tab === 'stubs' ? 'selectedTab' : 'tab'}
            >
              Stubs
            </li>
            <li
              onClick={() => setCurrentTab('cruds')}
              className={tab === 'cruds' ? 'selectedTab' : 'tab'}
            >
              Cruds
            </li>
            <li
              onClick={() => setCurrentTab('proxy')}
              className={tab === 'proxy' ? 'selectedTab' : 'tab'}
            >
              Proxy
            </li>
          </ul>
          {tab === 'stubs' && (
            <Stubs stubs={stubs} setStarter={build} onClear={() => setStubs({})} />
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

const fetchStubs = async set => {
  const res = await axios.get('/stubs');
  set(res.data);
};

const fetchCruds = async set => {
  const res = await axios.get('/cruds');
  set(res.data);
};

const fetchProxy = async set => {
  const res = await axios.get('/proxy');
  set(res.data);
};
