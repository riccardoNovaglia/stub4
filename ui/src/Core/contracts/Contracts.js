import React, { useState } from 'react';

import './Contracts.scss';

export function Contracts({ client }) {
  const [pactsCreated, setPactsCreated] = useState(false);

  async function contracts() {
    await client.generateContracts();
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
