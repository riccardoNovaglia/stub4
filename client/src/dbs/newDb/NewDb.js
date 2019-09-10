import React from 'react';

import './NewDb.scss';

export function NewDb({ afterSuccessfulCreation }) {
  const setup = async () => {
    afterSuccessfulCreation();
  };

  return (
    <div className="newDb">
      <button onClick={setup}>Save</button>
    </div>
  );
}
