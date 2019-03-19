import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Task } from './components/tasks/Task';
import { AddOrEditTasks } from './components/tasks/AddOrEditTasks';
import { Counter } from './components/Counter';
export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
        <Route path='/tasks' component={Task} />
        <Route path='/AddOrEditTasks' component={AddOrEditTasks} />
        <Route path='/counter' component={Counter} />
      </Layout>
    );
  }
}
