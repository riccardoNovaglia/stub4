import React from 'react';

import './SelectedDb.scss';

export function SelectedDb({ selectedDb }) {
  return (
    <div className="selectedDb">
      <div>
        {selectedDb.url} on {selectedDb.idAlias}
      </div>
    </div>
  );
}
