import React from 'react';
import { BrowserRouter as Router, Link, Route, Switch, Redirect } from 'react-router-dom';

import { Header } from './Header';
import { Core } from './Core/Core';
import { Documentation } from './Docs/Documentation';

import './App.scss';
import './Icons.scss';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/stub4/docs">
          <Documentation>
            <Header>
              <h1>Welcome to the Docs!</h1>
              <Link to="/stub4" className="backToStub4Button">
                Back to Stub4
              </Link>
            </Header>
          </Documentation>
        </Route>
        <Route path="/stub4">
          <Core>
            <Header>
              <h1>Welcome to Stub4!</h1>
              <Link to="/stub4/docs" className="helpButton">
                To the Docs
              </Link>
            </Header>
          </Core>
        </Route>
        <Redirect to="/stub4" />
      </Switch>
    </Router>
  );
}
