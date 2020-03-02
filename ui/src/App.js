import React from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';

import { Core } from './Core/Core';
import { Documentation } from './Docs/Documentation';

import './App.scss';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/docs">
          <Documentation>
            <NavButton to="/" label="Back to Stub4" className="helpButton" />
          </Documentation>
        </Route>
        <Route path="/">
          <Core>
            <NavButton to="/docs" label="Docs" className="backToStub4Button" />
          </Core>
        </Route>
      </Switch>
    </Router>
  );
}

const NavButton = ({ to, label, className }) => {
  const history = useHistory();

  return (
    <button type="button" onClick={() => history.push(to)} className={className}>
      {label}
    </button>
  );
};
