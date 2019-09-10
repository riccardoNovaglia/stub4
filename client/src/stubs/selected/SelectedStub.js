import React from 'react';

import './SelectedStub.scss';

export function SelectedStub({ selectedStub }) {
  return (
    <div className="selectedStub">
      <div>
        {selectedStub.request.method} {selectedStub.request.url}
      </div>
      <div>↓</div>
      <div>{selectedStub.response.contentType}</div>
      <div>{selectedStub.response.body}</div>
    </div>
  );
}
