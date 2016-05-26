import React, { Component } from 'react';
import { UISwipeableCards } from './ui';

class App extends Component {

  static displayName = 'App';

  state = {
    snkrs: [
      { id: 1000, name: 'Atomic Pink' },
      { id: 1001, name: 'Chicago' },
      { id: 1002, name: 'Bulls' },
      { id: 1003, name: 'UNC' },
      { id: 1004, name: 'Birch' },
      { id: 1005, name: 'Modern Made' },
      { id: 1006, name: 'OKC Thunder Away Gradient' },
      { id: 1007, name: 'Vachetta Tan' },
      { id: 1008, name: 'Carpe Diem' },
      { id: 1009, name: 'Avar Muse' },
      { id: 1010, name: 'Television' },
    ],
  };

  discardCard(i) {
    console.log('>>> Snkr discarded:', this.state.snkrs[i]);
  }

  renderCard(i) {
    const { id, name } = this.state.snkrs[i];
    return (
      <div className="snkr-card-content" id={`snkr-${id}`}>
        <p>{name}</p>
      </div>
    );
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
            onDiscard={::this.discardCard}
          />
        </section>
      </div>
    );
  }

}

export default App;
