import React from 'react';
import { BrowserRouter as Router, Link, Route, Switch, Redirect } from 'react-router-dom';

import { Core } from './Core/Core';
import { Documentation } from './Docs/Documentation';

import './App.scss';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/stub4/docs">
          <Documentation>
            <Link to="/stub4" className="backToStub4Button">
              Back to Stub4
            </Link>
          </Documentation>
        </Route>
        <Route path="/stub4">
          <Core>
            <Link to="/stub4/docs" className="helpButton">
              To the Docs
            </Link>
          </Core>
        </Route>
        <Redirect to="/stub4" />
      </Switch>
    </Router>
  );
}
