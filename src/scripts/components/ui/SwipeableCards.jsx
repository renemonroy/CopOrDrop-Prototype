import React, { Component, PropTypes } from 'react';
import { Motion, spring } from 'react-motion';
let styles = null;

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
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.state = {
      from,
      size,
      cardPressed: false,
      delta: 0,
      mouse: 0,
      isAnimating: false,
    };
  }

  componentDidMount() {
    this.discard = this.discard.bind(this);
    window.addEventListener('touchmove', this.handleTouchMove.bind(this));
    window.addEventListener('touchend', this.handleMouseUp.bind(this));
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    window.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  componentWillReceiveProps(next) {
    const { from, size } = this.state;
    this.setState(this.constrain(from, size, next));
  }

  setCardStyles(x, index) {
    if (index === 0) {
      const deg = x / 40;
      const transStyle = `translate3d(${x}px, 2.8rem, 0) scale(1) rotate(${deg}deg)`;
      return { transform: transStyle, WebkitTransform: transStyle };
    }
    return styles.card[`st${index}`];
  }

  animCard() {
    const { cardPressed, mouse } = this.state;
    const springConfig = { stiffness: 300, damping: 20 };
    return cardPressed ? { x: mouse } : { x: spring(0, springConfig) };
  }

  discard() {
    const { from, size } = this.state;
    const ps = this.props;
    if (ps.onDiscard) ps.onDiscard(from);
    this.setState({
      ...this.constrain(from + 1, size, this.props),
      isAnimating: false,
    });
  }

  constrain(from, size, { length }) {
    const diff = this.props.length - from;
    const maxSize = size > diff ? diff : size;
    const fromIndex = Math.max(Math.min(from, length), 0);
    return { from: fromIndex, size: maxSize };
  }

  handleTouchStart(pressX, e) {
    this.handleMouseDown(pressX, e.touches[0]);
  }

  handleTouchMove(e) {
    e.preventDefault();
    this.handleMouseMove(e.touches[0]);
  }

  handleMouseDown(pressX, { pageX }) {
    this.setState({
      delta: pageX - pressX,
      mouse: pressX,
      cardPressed: true,
      isAnimating: true,
    });
  }

  handleMouseMove({ pageX }) {
    const { cardPressed, delta } = this.state;
    if (cardPressed) {
      this.setState({ mouse: pageX - delta, isAnimating: true });
    }
  }

  handleMouseUp() {
    this.setState({ cardPressed: false, delta: 0, isAnimating: true });
  }

  render() {
    const { cardRenderer, cardWidth, cardHeight } = this.props;
    const { from, size, isAnimating } = this.state;
    const cards = [];
    const contStyles = { width: `${cardWidth}rem`, height: `${cardHeight}rem` };
    for (let i = 0; i < size; i++) {
      cards.unshift({ key: `snkr-card-${from + i}`, index: i });
    }
    return (
      <div className="ui-swipeable-cards">
        <div className="ui-swipeable-container" style={contStyles}>
          {cards.map(({ key, index }) =>
            <Motion
              style={this.animCard()}
              key={`ui-card-motion-${key}`}
              onRest={() => this.setState({ isAnimating: false })}
            >
              {({ x }) =>
                <div
                  onMouseDown={this.handleMouseDown.bind(null, x)}
                  onTouchStart={this.handleTouchStart.bind(null, x)}
                  key={key}
                  className={`ui-swipeable-card ${isAnimating ? '' : 'ui-transition'}`}
                  style={this.setCardStyles(x, index)}
                >
                  {cardRenderer(from + index, index)}
                </div>
              }
            </Motion>
          )}
        </div>
        <button
          style={styles.nextButton}
          onClick={() => this.discard()}
        >
          Next
        </button>
      </div>
    );
  }

}

styles = {
  card: {
    st1: {
      transform: 'translate3d(0, 1.4rem, 0) scale(0.95)',
      WebkitTransform: 'translate3d(0, 1.4rem, 0) scale(0.95)',
    },
    st2: {
      transform: 'translate3d(0, 0rem, 0) scale(0.9)',
      WebkitTransform: 'translate3d(0, 0rem, 0) scale(0.9)',
    },
    st3: {
      transform: 'translate3d(0, -1.4rem, 0) scale(0.85)',
      WebkitTransform: 'translate3d(0, -1.4rem, 0) scale(0.85)',
    },
    st4: {
      transform: 'translate3d(0, -2.8rem, 0) scale(0.8)',
      WebkitTransform: 'translate3d(0, -2.8rem, 0) scale(0.8)',
    },
  },
  nextButton: {
    position: 'relative',
    bottom: '-4rem',
    left: '50%',
    marginLeft: '-2.1rem',
  },
};

export default UISwipeableCards;
