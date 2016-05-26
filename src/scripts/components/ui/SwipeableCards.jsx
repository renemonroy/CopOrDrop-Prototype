import React, { Component, PropTypes } from 'react';
import { TransitionMotion, spring } from 'react-motion';
import Radium from 'radium';
let styles = null;

@Radium
class UISwipeableCards extends Component {

  static displayName = 'UISwipeableCards';

  static propTypes = {
    cardRenderer: PropTypes.func.isRequired,
    length: PropTypes.number,
    stackSize: PropTypes.number,
    initialIndex: PropTypes.number,
    cardWidth: PropTypes.number,
    cardHeight: PropTypes.number,
  };

  static defaultProps = {
    cardRenderer: (i, k) => <div key={k}>{i}</div>,
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

  componentDidMount() {
    this.discard = this.discard.bind(this);
  }

  componentWillReceiveProps(next) {
    const { from, size } = this.state;
    this.setState(this.constrain(from, size, next));
  }

  constrain(from, size, { length }) {
    const diff = this.props.length - from;
    const maxSize = size > diff ? diff : size;
    const fromIndex = Math.max(Math.min(from, length), 0);
    return { from: fromIndex, size: maxSize };
  }

  discard() {
    const { from, size } = this.state;
    const ps = this.props;
    if (ps.onDiscard) ps.onDiscard(from);
    this.setState(this.constrain(from + 1, size, this.props));
  }

  getDefaultCardsStyles(cards) {
    return cards.map(card => ({ ...card, style: { opacity: 1 } }));
  }

  getCardsStyles(cards) {
    return cards.map((card, i) => ({
      key: `snkr-card-${i}`,
      style: { opacity: spring(1, [236, 24]) },
    }));
  }

  cardWillEnter() {
    return { opacity: 1 };
  }

  renderCards() {
    const { cardRenderer, cardWidth, cardHeight } = this.props;
    const { from, size } = this.state;
    console.log(this.state);
    const cards = [];
    // for (let i = 0; i < size; ++i) {
    //   cards.unshift(
    //     <div
    //       className="ui-swipeable-card"
    //       style={styles.card[`st${i}`]}
    //       key={`snkr-card-${from + i}`}
    //     >
    //       {cardRenderer(from + i, i)}
    //     </div>
    //   );
    // }
    for (let i = 0; i < size; ++i) {
      cards.unshift({ key: `snkr-card-${from + i}`, opacity: 1 });
    }

    console.log('cards', cards);

    const dimStyles = { width: `${cardWidth}rem`, height: `${cardHeight}rem` };
    return (
      <TransitionMotion
        defaultStyles={this.getDefaultCardsStyles(cards)}
        styles={this.getCardsStyles(cards)}
        willEnter={this.cardWillEnter}
      >
        {interpolatedStyles =>
          <div className="ui-swipeable-container" style={dimStyles}>
            {console.log(interpolatedStyles)}
            {interpolatedStyles.map((config, i) =>
              <div
                key={config.key}
                id={config.key}
                style={[...config.style, styles.card[`st${i}`]]}
                className="ui-swipeable-card"
              >
                {cardRenderer(from + i, i)}
              </div>
            )}
          </div>
        }
      </TransitionMotion>
    );
  }

  render() {
    const cards = this.renderCards();
    return (
      <div className="ui-swipeable-cards">
        {cards}
        <button
          style={styles.discardButton}
          onClick={() => this.discard()}
        >
          discard
        </button>
      </div>
    );
  }

}

styles = {
  card: {
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
  discardButton: {
    position: 'relative',
    bottom: '-4rem',
    left: '50%',
    marginLeft: '-2.1rem',
  },
};

export default UISwipeableCards;
