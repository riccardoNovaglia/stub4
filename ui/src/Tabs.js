import React from 'react';

export default function Tabs({ tab, setCurrentTab }) {
  return (
    <ul className="tabrow">
      <li
        onClick={() => setCurrentTab('stubs')}
        className={tab === 'stubs' ? 'selectedTab' : 'tab'}
      >
        Stubs<i className="material-icons">import_export</i>
      </li>
      <li
        onClick={() => setCurrentTab('scenarios')}
        className={tab === 'scenarios' ? 'selectedTab' : 'tab'}
      >
        Scenarios<i className="material-icons">filter_list</i>
      </li>
      <li
        onClick={() => setCurrentTab('cruds')}
        className={tab === 'cruds' ? 'selectedTab' : 'tab'}
      >
        Cruds<i className="material-icons">swap_horiz</i>
      </li>
      <li
        onClick={() => setCurrentTab('proxy')}
        className={tab === 'proxy' ? 'selectedTab' : 'tab'}
      >
        Proxy<i className="material-icons">redo</i>
      </li>
    </ul>
  );
}
