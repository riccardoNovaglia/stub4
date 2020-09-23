import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import { ItemModal } from '../prototypes/stubsComponents/ItemModal';

import { ProxyEditor } from './ProxyEditor';
import { proxy as allProxy } from '@stub4/client';

export function EditProxy() {
  const [proxy, setProxy] = useState(null);
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    async function getProxy() {
      try {
        const proxy = await allProxy.getById(id);
        setProxy(proxy);
      } catch (e) {
        setProxy('NOT_FOUND');
      }
    }
    getProxy();
  }, [id]);

  const close = () => history.push(location.pathname.replace(`/edit/${id}`, ''));

  function getProxy(proxy) {
    switch (proxy) {
      case null:
        return <p>Just a second...</p>;
      case 'NOT_FOUND':
        return <p>Proxy not found with id '{id}'</p>;
      default:
        return <ProxyEditor onClose={close} onSaved={close} editedItem={proxy} />;
    }
  }

  return (
    <ItemModal itemName={'Proxy'} onClose={close}>
      {getProxy(proxy)}
    </ItemModal>
  );
}

export function NewProxy() {
  const history = useHistory();
  const location = useLocation();

  const close = () => history.push(history.push(location.pathname.replace(`/new`, '')));

  return (
    <ItemModal itemName={'Proxy'} onClose={close}>
      <ProxyEditor onClose={close} onSaved={close} editedItem={null} />
    </ItemModal>
  );
}
