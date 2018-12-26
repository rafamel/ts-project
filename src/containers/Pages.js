import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './Home';
import Info from './Info';

const Pages = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route component={Info} />
  </Switch>
);

export default Pages;
