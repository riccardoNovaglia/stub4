import { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import { cruds } from '@stub4/client';

import { CrudEditor } from './CrudEditor';
import { ItemModal } from '../prototypes/stubsComponents/ItemModal';

export function EditCrud() {
  const [crud, setCrud] = useState(null);
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    async function getCrud() {
      try {
        const crud = await cruds.getById(id);
        setCrud(crud);
      } catch (e) {
        setCrud('NOT_FOUND');
      }
    }
    getCrud();
  }, [id]);

  const close = () => history.push(location.pathname.replace(`/edit/${id}`, ''));

  function getCrud(crud) {
    switch (crud) {
      case null:
        return <p>Just a second...</p>;
      case 'NOT_FOUND':
        return <p>Crud not found with id '{id}'</p>;
      default:
        return <CrudEditor onClose={close} onSaved={close} editedItem={crud} />;
    }
  }

  return (
    <ItemModal itemName={'Crud'} onClose={close}>
      {getCrud(crud)}
    </ItemModal>
  );
}

export function NewCrud() {
  const history = useHistory();
  const location = useLocation();

  const close = () => history.push(history.push(location.pathname.replace(`/new`, '')));

  return (
    <ItemModal itemName={'Crud'} onClose={close}>
      <CrudEditor onClose={close} onSaved={close} editedItem={null} />
    </ItemModal>
  );
}
