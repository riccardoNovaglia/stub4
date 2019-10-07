import React, { useState } from 'react';

import Stub4 from '@stub4/stubClient';

import './Contracts.scss';

const contractsClient = new Stub4.ContractsClient();

export function Contracts() {
  const [pactsCreated, setPactsCreated] = useState(false);

  async function contracts() {
    await contractsClient.generateContracts();
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
