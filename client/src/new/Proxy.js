import React from 'react';

import { Url } from './Url';

export function Proxy({ proxy, handle }) {
  return (
    <>
      <Url url={proxy.url} handle={handle} />

      <div>
        <label htmlFor="proxyUrl">PROXY URL</label>
        <input
          id="proxyUrl"
          type="text"
          onChange={handle(proxy.proxyUrl.set)}
          value={proxy.proxyUrl.value}
        />
      </div>
    </>
  );
}
