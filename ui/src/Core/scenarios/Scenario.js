import { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import { scenarios } from '@stub4/client';

import { ScenarioEditor } from './ScenarioEditor';
import { ItemModal } from '../prototypes/stubsComponents/ItemModal';

export function EditScenario() {
  const [scenario, setScenario] = useState(null);
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    async function getScenario() {
      try {
        const scenario = await scenarios.getById(id);
        setScenario(scenario);
      } catch (e) {
        setScenario('NOT_FOUND');
      }
    }
    getScenario();
  }, [id]);

  const close = () => history.push(location.pathname.replace(`/edit/${id}`, ''));

  function getScenario(scenario) {
    switch (scenario) {
      case null:
        return <p>Just a second...</p>;
      case 'NOT_FOUND':
        return <p>Scenario not found with id '{id}'</p>;
      default:
        return <ScenarioEditor onClose={close} onSaved={close} editedItem={scenario} />;
    }
  }

  return (
    <ItemModal itemName={'Scenario'} onClose={close}>
      {getScenario(scenario)}
    </ItemModal>
  );
}

export function NewScenario() {
  const history = useHistory();
  const location = useLocation();

  const close = () => history.push(history.push(location.pathname.replace(`/new`, '')));

  return (
    <ItemModal itemName={'Scenario'} onClose={close}>
      <ScenarioEditor onClose={close} onSaved={close} editedItem={null} />
    </ItemModal>
  );
}
