import React, { useState } from 'react';

import Stub4 from '@stub4/client';

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
        <span>
          <i className="material-icons">dynamic_feed</i>Generate Contracts
        </span>
      </button>
      {pactsCreated && <p>Ok</p>}
    </>
  );
}
