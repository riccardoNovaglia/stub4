import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import { Index, DocsLink, DocsSubLink } from './Index';
import { Contents } from './Contents';

import { Motivation } from './contents/Motivation';
import { What } from './contents/What';
import { How, Stubs, Cruds, Scenarios, Proxy } from './contents/How';
import { Next } from './contents/Next';

import './Documentation.scss';

function Documentation({ children }) {
  return (
    <div className="docsBody">
      <div>
        {children}
        <h1 className="docsTitle">Welcome to the Docs!</h1>
      </div>

      <div className="docsContent">
        <div className="column">
          <Index>
            <DocsLink label="Motivation" path="/docs/why" />
            <DocsLink label="How it works" path="/docs/what" />

            <DocsLink label="How to use it" path="/docs/how" />
            <DocsSubLink
              label="How to create a stub"
              path="/docs/how/stubs"
              parentPath="/docs/how"
            />
            <DocsSubLink
              label="How to create a crud"
              path="/docs/how/cruds"
              parentPath="/docs/how"
            />
            <DocsSubLink
              label="How to create scenarios"
              path="/docs/how/scenarios"
              parentPath="/docs/how"
            />
            <DocsSubLink
              label="How to create a proxy"
              path="/docs/how/proxy"
              parentPath="/docs/how"
            />

            <DocsLink label="Next" path="/docs/next" />
          </Index>
        </div>
        <div className="centerColumn">
          <Contents>
            <Route path="/docs/why" component={Motivation} />
            <Route path="/docs/what" component={What} />

            <Route path="/docs/how/stubs" component={Stubs} />
            <Route path="/docs/how/cruds" component={Cruds} />
            <Route path="/docs/how/scenarios" component={Scenarios} />
            <Route path="/docs/how/proxy" component={Proxy} />
            <Route path="/docs/how" component={How} />

            <Route path="/docs/next" component={Next} />
            <Redirect to="/docs/why" />
          </Contents>
        </div>
      </div>
    </div>
  );
}

export { Documentation };
