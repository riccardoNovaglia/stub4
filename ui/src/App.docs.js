import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import { Header } from './Header';
import { Documentation } from './Docs/Documentation';

import './App.scss';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/stub4/docs">
          <Documentation>
            <Header>
              <h1>Welcome to Stub4's Docs!</h1>
            </Header>
          </Documentation>
        </Route>
        <Redirect to="/stub4/docs" />
      </Switch>
    </Router>
  );
}
