import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import './Tabs.scss';

export default function Tabs({ children }) {
  const location = useLocation();
  return (
    <div className="tabsContent">
      <nav className="tabrow">
        <Link
          to="/stub4/stubs"
          className={location.pathname === '/stub4/stubs' ? 'selectedTab' : 'tab'}
        >
          Stubs <i className="material-icons">import_export</i>
        </Link>
        <Link
          to="/stub4/scenarios"
          className={location.pathname === '/stub4/scenarios' ? 'selectedTab' : 'tab'}
        >
          Scenarios <i className="material-icons">filter_list</i>
        </Link>
        <Link
          to="/stub4/cruds"
          className={location.pathname === '/stub4/cruds' ? 'selectedTab' : 'tab'}
        >
          Cruds <i className="material-icons">storefront</i>
        </Link>
        <Link
          to="/stub4/proxy"
          className={location.pathname === '/stub4/proxy' ? 'selectedTab' : 'tab'}
        >
          Proxy <i className="material-icons">redo</i>
        </Link>
      </nav>
      {children}
    </div>
  );
}
