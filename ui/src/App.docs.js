import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import { Documentation } from './Docs/Documentation';

import './App.scss';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/stub4/docs">
          <Documentation />
        </Route>
        <Redirect to="/stub4/docs" />
      </Switch>
    </Router>
  );
}
