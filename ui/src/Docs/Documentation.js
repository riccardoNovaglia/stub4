import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';

import { Index, DocsLink, DocsSubLink } from './Index';
import { Contents } from './Contents';

import { Motivation } from './contents/Motivation';
import { What } from './contents/What';
import { How, Stubs, Cruds, Scenarios, Proxy } from './contents/How';
import { Next } from './contents/Next';

import { UrlContext } from '../App';
import './Documentation.scss';

function Documentation({ children }) {
  const url = useContext(UrlContext);
  const pathInContext = path => `${url}${path}`;

  return (
    <div className="docsBody">
      <div>
        {children}
        <h1 className="docsTitle">Welcome to the Docs!</h1>
      </div>

      <div className="docsContent">
        <div className="column">
          <Index>
            <DocsLink label="Motivation" path={pathInContext('docs/why')} />
            <DocsLink label="How it works" path={pathInContext('docs/what')} />

            <DocsLink label="How to use it" path={pathInContext('docs/how')} />
            <DocsSubLink
              label="How to create a stub"
              path={pathInContext('docs/how/stubs')}
              parentPath={pathInContext('docs/how')}
            />
            <DocsSubLink
              label="How to create a crud"
              path={pathInContext('docs/how/cruds')}
              parentPath={pathInContext('docs/how')}
            />
            <DocsSubLink
              label="How to create scenarios"
              path={pathInContext('docs/how/scenarios')}
              parentPath={pathInContext('docs/how')}
            />
            <DocsSubLink
              label="How to create a proxy"
              path={pathInContext('docs/how/proxy')}
              parentPath={pathInContext('docs/how')}
            />

            <DocsLink label="Next" path={pathInContext('docs/next')} />
          </Index>
        </div>
        <div className="centerColumn">
          <Contents>
            <Route path={pathInContext('docs/why')} component={Motivation} />
            <Route path={pathInContext('docs/what')} component={What} />

            <Route path={pathInContext('docs/how/stubs')} component={Stubs} />
            <Route path={pathInContext('docs/how/cruds')} component={Cruds} />
            <Route path={pathInContext('docs/how/scenarios')} component={Scenarios} />
            <Route path={pathInContext('docs/how/proxy')} component={Proxy} />
            <Route path={pathInContext('docs/how')} component={How} />

            <Route path={pathInContext('docs/next')} component={Next} />
            <Redirect to={pathInContext('docs/why')} />
          </Contents>
        </div>
      </div>
    </div>
  );
}

export { Documentation };
