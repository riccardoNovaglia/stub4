import React from 'react';

import './SelectedProxy.scss';

export function SelectedProxy({ selectedProxy, setStarter }) {
  // const [interactions, setInteractions] = useState(undefined);
  // const [countClass, setCountClass] = useState('flashing');

  // useEffect(() => {
  //   fetchInteractions(selectedProxy.request.url, setInteractions);
  //   const interval = setInterval(
  //     () => fetchInteractions(selectedProxy.request.url, setInteractions),
  //     1000
  //   );
  //   return () => clearInterval(interval);
  // }, [selectedProxy.request.url, interactions]);

  // useEffect(() => flashItem(setCountClass), [interactions]);

  return (
    <>
      <div className="selectedProxy">
        <div>{selectedProxy.request.url}</div>
        <div>↓</div>
        <div>{selectedProxy.proxyUrl}</div>
        <button
          className="newButton"
          onClick={() => setStarter({ type: 'proxy', proxy: selectedProxy })}
        >
          Edit
        </button>
      </div>
      {/* {interactions && <div className={countClass}>Called {interactions} times</div>} */}
    </>
  );
}

// async function fetchInteractions(url, set) {
//   const res = await axios.post('/proxy/count', { url });
//   set(res.data.count);
// }

// function flashItem(setCountClass) {
//   setCountClass('flash');
//   setTimeout(() => {
//     setCountClass('');
//   }, 500);
// }
