import _ from 'lodash';
import React from 'react';

import './ProxyList.scss';

export function ProxyList({ proxy, selected, setSelected }) {
  return (
    <div className="proxyList">
      {_.isEmpty(proxy) ? (
        <p className="noProxyMsg">No proxy have been created yet</p>
      ) : (
        proxy.map(proxy => (
          <div
            key={`${proxy.request.url}-item`}
            className="proxy"
            onClick={() => setSelected(proxy)}
          >
            <p
              className={
                selected && selected.request.url === proxy.request.url
                  ? 'selectedProxyDef'
                  : 'proxyDef'
              }
            >
              <span className="url">{proxy.request.url}</span>
              <span>→</span>
              <span className="proxyUrl">{proxy.proxyUrl}</span>
            </p>
          </div>
        ))
      )}
    </div>
  );
}
