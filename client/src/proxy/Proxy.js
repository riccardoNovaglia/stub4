import axios from 'axios';
import React, { useState } from 'react';

import { ProxyList } from './list/ProxyList';
import { SelectedProxy } from './selected/SelectedProxy';

import './Proxy.scss';

export function Proxy({ proxy, onClear, setStarter }) {
  const [selected, setSelected] = useState();

  const clear = async () => {
    await clearProxy();
    onClear();
  };

  return (
    <div>
      <h1 className="proxyTitle">Proxy</h1>
      <button className="clearProxyBtn" onClick={clear}>
        CLEAR
      </button>
      <div className="proxyBody">
        <ProxyList proxy={proxy} selected={selected} setSelected={setSelected} />
        {selected && <SelectedProxy selectedProxy={selected} setStarter={setStarter} />}
      </div>
    </div>
  );
}

const clearProxy = async () => {
  await axios.post('/proxy/clear');
};
