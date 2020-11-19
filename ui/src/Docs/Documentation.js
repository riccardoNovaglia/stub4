import { Redirect, Route } from 'react-router-dom';

import { Index, DocsLink, DocsSubLink } from './Index';
import { Contents } from './Contents';

import { Motivation, motivationPath } from './contents/Motivation';
import { Features, featuresPath } from './contents/Features';
import { Concepts, conceptsPath } from './contents/Concepts';
import { How, howPath } from './contents/How';
import { Next, nextPath } from './contents/Next';

import { Starting, startingPath } from './contents/How/Starting';
import { RequestMatcher, requestMatcherPath } from './contents/How/RequestMatcher';
import { Stubs, stubsPath } from './contents/How/Stubs';
import { Cruds, crudsPath } from './contents/How/Cruds';
import { Scenarios, scenariosPath } from './contents/How/Scenarios';
import { Proxy, proxyPath } from './contents/How/Proxy';
import { Config, configPath } from './contents/How/Config';

import './Documentation.scss';

function Documentation({ children }) {
  return (
    <div className="Docs">
      {children}
      <div className="docsContent">
        <div className="column">
          <Index>
            <DocsLink label="Motivation" path={motivationPath} />
            <DocsLink label="Features" path={featuresPath} />
            <DocsLink label="Concepts" path={conceptsPath} />
            <DocsLink label="How to use it" path={howPath} />
            <DocsSubLink label="How to start Stub4" path={startingPath} />
            <DocsSubLink label="How to create a stub" path={stubsPath} />
            <DocsSubLink label="How to create a crud" path={crudsPath} />
            <DocsSubLink label="How to create scenarios" path={scenariosPath} />
            <DocsSubLink label="How to create a proxy" path={proxyPath} />
            <DocsSubLink label="Matching requests" path={requestMatcherPath} />
            <DocsSubLink label="How to configure Stub4" path={configPath} />

            <DocsLink label="Next" path={nextPath} />
          </Index>
        </div>
        <div className="centerColumn">
          <Contents>
            <Route exact path={motivationPath} component={Motivation} />
            <Route exact path={featuresPath} component={Features} />
            <Route exact path={conceptsPath} component={Concepts} />

            <Route exact path={howPath} component={How} />
            <Route path={requestMatcherPath} component={RequestMatcher} />
            <Route path={stubsPath} component={Stubs} />
            <Route path={startingPath} component={Starting} />
            <Route path={crudsPath} component={Cruds} />
            <Route path={scenariosPath} component={Scenarios} />
            <Route path={proxyPath} component={Proxy} />
            <Route path={configPath} component={Config} />

            <Route exact path={nextPath} component={Next} />
            <Redirect to={motivationPath} />
          </Contents>
        </div>
      </div>
    </div>
  );
}

export { Documentation };
