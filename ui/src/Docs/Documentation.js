import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import { Index, DocsLink, DocsSubLink } from './Index';
import { Contents } from './Contents';

import { Motivation } from './contents/Motivation';
import { What } from './contents/What';
import { How, Stubs, Cruds, Scenarios, Proxy, Config, RequestMatcher } from './contents/How';
import { Next } from './contents/Next';

import './Documentation.scss';

function Documentation({ children }) {
  return (
    <div className="Docs">
      {children}
      <div className="docsContent">
        <div className="column">
          <Index>
            <DocsLink label="Motivation" path={'/stub4/docs/why'} />
            <DocsLink label="What is it" path={'/stub4/docs/what'} />
            <DocsLink label="How to use it" path={'/stub4/docs/how'} />
            <DocsSubLink label="How to create a stub" path={'/stub4/docs/how/stubs'} />
            <DocsSubLink label="How to create a crud" path={'/stub4/docs/how/cruds'} />
            <DocsSubLink label="How to create scenarios" path={'/stub4/docs/how/scenarios'} />
            <DocsSubLink label="How to create a proxy" path={'/stub4/docs/how/proxy'} />
            <DocsSubLink label="Matching requests" path={'/stub4/docs/how/requestMatcher'} />
            <DocsSubLink label="How to configure Stub4" path={'/stub4/docs/how/config'} />

            <DocsLink label="Next" path={'/stub4/docs/next'} />
          </Index>
        </div>
        <div className="centerColumn">
          <Contents>
            <Route path={'/stub4/docs/why'} component={Motivation} />
            <Route path={'/stub4/docs/what'} component={What} />

            <Route path={'/stub4/docs/how/config'} component={Config} />
            <Route path={'/stub4/docs/how/requestMatcher'} component={RequestMatcher} />
            <Route path={'/stub4/docs/how/stubs'} component={Stubs} />
            <Route path={'/stub4/docs/how/cruds'} component={Cruds} />
            <Route path={'/stub4/docs/how/scenarios'} component={Scenarios} />
            <Route path={'/stub4/docs/how/proxy'} component={Proxy} />
            <Route path={'/stub4/docs/how'} component={How} />

            <Route path={'/stub4/docs/next'} component={Next} />
            <Redirect to={'/stub4/docs/why'} />
          </Contents>
        </div>
      </div>
    </div>
  );
}

export { Documentation };
