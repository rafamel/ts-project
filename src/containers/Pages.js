import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Info from './pages/Info';

const Pages = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route component={Info} />
  </Switch>
);

export default Pages;
