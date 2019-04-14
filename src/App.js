import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import NewEntry from './components/NewEntry'
import Entry from './components/Entry'
import Login from './components/Login'
import SignUp from './components/SignUp'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
            <Navbar />
            <div className="container">
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/new" component={NewEntry} />
                <Route path="/edit/entries/:entry_id" component={Entry} />
                <Route path="/login" component={Login} />
                <Route path="/signup" component={SignUp} />
              </Switch>
            </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
