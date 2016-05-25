import React, { Component } from 'react';
import { UISwipeableCards } from './ui';

class App extends Component {

  static displayName = 'App';

  state = {
    snkrs: [1, 2, 3, 4, 5, 6],
  };

  renderCard(i) {
    return this.state.snkrs[i];
  }

  render() {
    const { snkrs } = this.state;
    return (
      <div id="app">
        <section>
          <p>App</p>
          <UISwipeableCards
            cardRenderer={::this.renderCard}
            length={snkrs.length}
            stackSize={4}
            initialIndex={2}
          />
        </section>
      </div>
    );
  }

}

export default App;
