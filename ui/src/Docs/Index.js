import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import './Index.scss';

function Index({ children }) {
  return (
    <>
      <h2 className="indexTitle">Index</h2>
      <ul>{children}</ul>
    </>
  );
}

function DocsLink({ path, label }) {
  const { pathname } = useLocation();
  const linkClassName = to => (pathname.startsWith(to) ? 'selectedDocsLink' : 'docsLink');

  return (
    <li className="indexListItem" key={path}>
      <Link to={path} className={linkClassName(path)}>
        {label}
      </Link>
    </li>
  );
}

function DocsSubLink({ path, parentPath, label }) {
  const { pathname } = useLocation();
  const linkClassName = pathname === path ? 'selectedSubDocsLink' : 'subDocsLink';

  return (
    pathname.startsWith(parentPath) && (
      <li className="indexListSubItem" key={path}>
        <Link to={path} className={linkClassName}>
          {label}
        </Link>
      </li>
    )
  );
}

export { Index, DocsLink, DocsSubLink };
