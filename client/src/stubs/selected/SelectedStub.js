import axios from 'axios';
import React, { useEffect, useState } from 'react';

import './SelectedStub.scss';

export function SelectedStub({ selectedStub }) {
  const [interactions, setInteractions] = useState(0);

  useEffect(() => {
    fetchInteractions(selectedStub.request.url, setInteractions);
    const interval = setInterval(() => {
      fetchInteractions(selectedStub.request.url, setInteractions);
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedStub.request.url, setInteractions]);

  return (
    <>
      <div className="selectedStub">
        <div>
          {selectedStub.request.method} {selectedStub.request.url}
        </div>
        <div>↓</div>
        <div>{selectedStub.response.contentType}</div>
        <div>{selectedStub.response.body}</div>
      </div>
      <div className="interactions">Called {interactions.count} times</div>
    </>
  );
}

export const fetchInteractions = async (url, set) => {
  const res = await axios.post('/stubs/count', { url });
  set(res.data);
};
