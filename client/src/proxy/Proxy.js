import React, { useState } from 'react';

import { ProxyList } from './list/ProxyList';
import { SelectedProxy } from './selected/SelectedProxy';
import Stub4 from '@stub4/client';

const proxyClient = new Stub4.ProxyClient();

export function Proxy({ proxy, onClear, setStarter }) {
  const [selected, setSelected] = useState();

  const clear = async () => {
    await proxyClient.clearProxy();
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
