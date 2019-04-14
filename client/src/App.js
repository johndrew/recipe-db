import React, { Component } from 'react';
import RecipeScreen from './containers/RecipeScreen';

import './App.scss';

class App extends Component {

  render() {

    return (
      <div className="app__container">
        <RecipeScreen></RecipeScreen>
      </div>
    );
  }
}

export default App;
