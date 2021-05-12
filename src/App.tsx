import React from 'react';
import { Router, Link, Route, Switch } from 'react-router-dom';
import { Swap } from './Swap/Swap';
import './App.css';
import { globalHistory } from './createBrowserHistory';

export const App: React.FC = () => {
  return (
    <div className="App">
      <Router history={globalHistory}>
        <h2>ErgoDex</h2>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/swap">Swap</Link>
              </li>
            </ul>
          </nav>

          {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/swap">
              <Swap />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
};
