import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import './Tabs.scss';

export default function Tabs() {
  const location = useLocation();
  return (
    <nav className="tabrow">
      <Link to="/stubs" className={location.pathname === '/stubs' ? 'selectedTab' : 'tab'}>
        Stubs <i className="material-icons">import_export</i>
      </Link>
      <Link to="/scenarios" className={location.pathname === '/scenarios' ? 'selectedTab' : 'tab'}>
        Scenarios <i className="material-icons">filter_list</i>
      </Link>
      <Link to="/cruds" className={location.pathname === '/cruds' ? 'selectedTab' : 'tab'}>
        Cruds <i className="material-icons">swap_horiz</i>
      </Link>
      <Link to="/proxy" className={location.pathname === '/proxy' ? 'selectedTab' : 'tab'}>
        Proxy <i className="material-icons">redo</i>
      </Link>
    </nav>
  );
}
