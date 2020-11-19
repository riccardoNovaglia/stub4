import { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import { stubs } from '@stub4/client';

import { StubEditor } from './StubEditor';
import { ItemModal } from '../prototypes/stubsComponents/ItemModal';

export function EditStub() {
  const [stub, setStub] = useState(null);
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    async function getStub() {
      try {
        const stub = await stubs.getById(id);
        setStub(stub);
      } catch (e) {
        setStub('NOT_FOUND');
      }
    }
    getStub();
  }, [id]);

  const close = () => history.push(location.pathname.replace(`/edit/${id}`, ''));

  function getStub(stub) {
    switch (stub) {
      case null:
        return <p>Just a second...</p>;
      case 'NOT_FOUND':
        return <p>Stub not found with id '{id}'</p>;
      default:
        return <StubEditor onClose={close} onSaved={close} editedItem={stub} />;
    }
  }

  return (
    <ItemModal itemName={'Stub'} onClose={close}>
      {getStub(stub)}
    </ItemModal>
  );
}

export function NewStub() {
  const history = useHistory();
  const location = useLocation();

  const close = () => history.push(history.push(location.pathname.replace(`/new`, '')));

  return (
    <ItemModal itemName={'Stub'} onClose={close}>
      <StubEditor onClose={close} onSaved={close} editedItem={null} />
    </ItemModal>
  );
}
