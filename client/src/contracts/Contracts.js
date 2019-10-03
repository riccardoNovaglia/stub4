import axios from 'axios';
import React, { useState } from 'react';

import './Contracts.scss';

export function Contracts() {
  const [pactsCreated, setPactsCreated] = useState(false);

  async function contracts() {
    await generateContracts();
    setPactsCreated(true);
  }

  return (
    <>
      <button onClick={() => contracts()} className="contractsButton">
        Generate Contracts
      </button>
      {pactsCreated && <p>Ok</p>}
    </>
  );
}

const generateContracts = async () => {
  await axios.post('/generate-pact', { consumer: 'SomeApp' });
};