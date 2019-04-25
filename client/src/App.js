import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import LoginScreen from './containers/LoginScreen/LoginScreen';
import RecipeScreen from './containers/RecipeScreen';

import './App.scss';

class App extends Component {

  render() {

    return (
      <div className="app__container">
        <Router>
          <div>
            <Route exact path="/" component={LoginScreen} />
            <Route path="/recipes" component={RecipeScreen} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
