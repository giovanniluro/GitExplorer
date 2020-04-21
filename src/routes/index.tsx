import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Dashboard from '../pages/dashboard';
import Repository from '../pages/repository';

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/repository/:repository+" component={Repository} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
