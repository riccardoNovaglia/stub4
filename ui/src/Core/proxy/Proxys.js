import { Route, useHistory } from 'react-router-dom';

import { Panel } from '../prototypes/stubsComponents/Panel';
import { EditProxy, NewProxy } from './Proxy';

import { ProxyList } from './ProxyList';

export function Proxy({ client }) {
  const history = useHistory();
  // TODO: last place to remove the client!
  const fetch = async (set) => await client.fetchProxy(set);
  const clear = async () => await client.clearProxy();

  const onSelect = (item) => history.push(`/stub4/proxy/edit/${item.id}`);

  return (
    <>
      <Route path="/stub4/proxy/edit/:id">
        <EditProxy />
      </Route>
      <Route path="/stub4/proxy/new">
        <NewProxy />
      </Route>
      <Route>
        <Panel
          itemsLifecycle={{ fetch, clear }}
          presentation={{ label: 'Proxy', icon: 'redo', className: 'proxyBody' }}
          pathBased={true}
        >
          {{
            list: (items, _) => <ProxyList items={items} selected={null} setSelected={onSelect} />,
            preview: (_) => <></>,
            create: (_) => <></>
          }}
        </Panel>
      </Route>
    </>
  );
}
