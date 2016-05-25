import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
let styles = null;

@Radium
class UISwipeableCards extends Component {

  static displayName = 'UISwipeableCards';

  static propTypes = {
    cardRenderer: PropTypes.func.isRequired,
    cardsRenderer: PropTypes.func.isRequired,
    length: PropTypes.number,
    stackSize: PropTypes.number,
    initialIndex: PropTypes.number,
    cardWidth: PropTypes.number,
    cardHeight: PropTypes.number,
  };

  static defaultProps = {
    cardRenderer: (i, k) =>
      <div key={k}>{i}</div>,
    cardsRenderer: (cards, ref, dimStyles) =>
      <div ref={ref} style={[dimStyles, styles.container]}>{cards}</div>,
    length: 0,
    stackSize: 3,
    initialIndex: 0,
    cardWidth: 24,
    cardHeight: 32,
  }

  constructor(props) {
    super(props);
    const { initialIndex, stackSize } = this.props;
    const maxSize = stackSize > 5 ? 5 : stackSize;
    const { from, size } = this.constrain(initialIndex, maxSize, this.props);
    this.state = { from, size };
  }

  componentWillReceiveProps(next) {
    const { from, size } = this.state;
    this.setState(this.constrain(from, size, next));
  }

  constrain(from, size, { length, stackSize }) {
    let maxSize = Math.max(size, stackSize);
    if (maxSize > length) maxSize = length;
    const fromIndex = Math.max(Math.min(from, length - maxSize), 0);
    return { from: fromIndex, size: maxSize };
  }

  renderCards() {
    const { cardRenderer, cardsRenderer, cardWidth, cardHeight } = this.props;
    const { from, size } = this.state;
    const cards = [];
    for (let i = 0; i < size; ++i) {
      const cardStyl = styles.card;
      cards.unshift(
        <div style={[cardStyl, cardStyl[`st${i}`]]} key={`snkr-card-${i}`}>
          {cardRenderer(from + i, i)}
        </div>
      );
    }
    const dimStyles = { width: `${cardWidth}rem`, height: `${cardHeight}rem` };
    return cardsRenderer(cards, c => (this.cards = c), dimStyles);
  }

  render() {
    const cards = this.renderCards();
    return (
      <div className="ui-swipeable-cards">
        {cards}
      </div>
    );
  }

}

styles = {
  container: {
    position: 'relative',
    margin: '0 auto',
    perspective: '1500px',
  },
  card: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e1e1e1',
    zIndex: 2,
    position: 'absolute',
    left: 0,
    right: 0,
    borderTop: '1px solid #ccc',
    st0: {
      transform: 'scale(1) translateY(2.8rem)',
    },
    st1: {
      transform: 'scale(0.95) translateY(1.4rem)',
    },
    st2: {
      transform: 'scale(0.9) translateY(0rem)',
    },
    st3: {
      transform: 'scale(0.85) translateY(-1.4rem)',
    },
    st4: {
      transform: 'scale(0.8) translateY(-2.8rem)',
    },
  },
};

export default UISwipeableCards;
