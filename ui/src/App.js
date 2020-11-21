import * as React from 'react';

import { BrowserRouter as Router, Link, Route, Switch, Redirect } from 'react-router-dom';

import { Header } from './Header';

import './App.scss';
import './Icons.scss';

const Core = React.lazy(() => import('./Core/Core'));
const Documentation = React.lazy(() => import('./Docs/Documentation'));

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/stub4/docs">
          <JustASecSuspense>
            <Documentation>
              <Header>
                <h1>Welcome to the Docs!</h1>
                <Link to="/stub4" className="backToStub4Button">
                  Back to Stub4
                </Link>
              </Header>
            </Documentation>
          </JustASecSuspense>
        </Route>
        <Route path="/stub4">
          <JustASecSuspense>
            <Core>
              <Header>
                <h1>Welcome to Stub4!</h1>
                <Link to="/stub4/docs" className="helpButton">
                  To the Docs
                </Link>
              </Header>
            </Core>
          </JustASecSuspense>
        </Route>
        <Redirect to="/stub4" />
      </Switch>
    </Router>
  );
}

function JustASecond() {
  return (
    <>
      <Header>
        <h1>Welcome to Stub4!</h1>
      </Header>
      <p>Just a second...</p>
    </>
  );
}

function JustASecSuspense({ children }) {
  return <React.Suspense fallback={<JustASecond />}>{children}</React.Suspense>;
}
