import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import './Index.scss';

function Index() {
  return (
    <>
      <h2 className="indexTitle">Index</h2>
      <ul>
        <DocsLink label="Motivation" path="/docs/why" />
        <DocsLink label="How it works" path="/docs/what" />

        <DocsLink label="How to use it" path="/docs/how" />
        <DocsSubLink label="How to stub" path="/docs/how/stubs" parentPath="/docs/how" />

        <DocsLink label="Next" path="/docs/next" />
      </ul>
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
