require('./ui/index.styl');
import React from 'react';
import SnkrsVoteScene from './scenes/SnkrsVote.jsx';

const App = () =>
  <div id="app">
    <header className="u-align-center">
      <h3 className="ncss-brand">COP || DROP</h3>
    </header>
    <SnkrsVoteScene />
  </div>;

export default App;
