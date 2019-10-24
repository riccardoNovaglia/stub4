import React, { useState, useEffect } from 'react';

import { ProxyList } from './list/ProxyList';
import { SelectedProxy } from './selected/SelectedProxy';

export function Proxy({ onClear, setStarter, client }) {
  const [selected, setSelected] = useState();
  const [proxy, setProxy] = useState([]);
  useEffect(() => {
    client.fetchProxy(setProxy);
  }, [setProxy, client]);

  const clear = async () => {
    await client.clearProxy();
    onClear();
  };

  return (
    <div className="panel">
      <h1>
        Proxy<i className="material-icons">redo</i>
      </h1>
      <button className="clearBtn" onClick={clear}>
        <i className="material-icons">clear_all</i>Clear
      </button>
      <div className="proxyBody">
        <ProxyList proxy={proxy} selected={selected} setSelected={setSelected} />
        {selected && <SelectedProxy selectedProxy={selected} setStarter={setStarter} />}
      </div>
    </div>
  );
}
