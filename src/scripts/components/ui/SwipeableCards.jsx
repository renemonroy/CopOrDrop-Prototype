import React, { Component, PropTypes } from 'react';
import { Motion, spring } from 'react-motion';
import { fastEaseOutElastic } from '../../constants/SpringPresets';
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
    cardWidth: 320,
    cardHeight: 480,
  }

  constructor(props) {
    super(props);
    const { initialIndex, stackSize } = this.props;
    const maxSize = stackSize > 5 ? 5 : stackSize;
    const { from, size } = this.constrain(initialIndex, maxSize, this.props);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.state = {
      from,
      size,
      delta: 0,
      mouse: 0,
      limit: 160,
      decision: 0,
      condition: 0, // default: 0, isCancelling: 1, isDragging: 2, isLeaving: 3
    };
  }

  componentDidMount() {
    this.shouldRemoveEvents = false;
    this.discard = this.discard.bind(this);
    this.addEvents();
  }

  componentWillReceiveProps(next) {
    const { from, size } = this.state;
    this.setState(this.constrain(from, size, next));
  }

  getCardStyles(x, opacity) {
    const { limit, condition } = this.state;
    let deg = 0;
    let val = x;
    let opac = opacity;
    switch (condition) {
      case 1:
        deg = val / 40;
        break;
      case 2:
        deg = val / 40;
        break;
      case 3:
        val = -(limit * 2);
        break;
      default:
        val = 0;
        opac = 1;
    }
    const transStyle = `translate3d(${val}px, 40px, 0) scale(1) rotate(${deg}deg)`;
    return {
      transform: transStyle,
      WebkitTransform: transStyle,
      opacity: opac,
    };
  }

  animCard() {
    const { mouse, condition } = this.state;
    switch (condition) {
      case 1:
        return { x: spring(0, fastEaseOutElastic), opacity: spring(1) };
      case 2:
        return { x: mouse, opacity: spring(0.8) };
      case 3:
        return { x: spring(0, fastEaseOutElastic), opacity: 0 };
      default:
        return { x: spring(0, fastEaseOutElastic), opacity: 1 };
    }
  }

  discard() {
    const { from, size } = this.state;
    const ps = this.props;
    if (ps.onDiscard) ps.onDiscard(from);
    this.restart(from + 1, size);
  }

  accept() {
    const { from, size } = this.state;
    const ps = this.props;
    if (ps.onAccept) ps.onAccept(from);
    this.restart(from + 1, size);
  }

  decide() {
    const { mouse, limit } = this.state;
    if (mouse >= limit) {
      this.setState({ condition: 3, delta: 0, decision: 1 }, ::this.accept);
    } else if (mouse <= -limit) {
      this.setState({ condition: 3, delta: 0, decision: -1 }, ::this.discard);
    } else {
      this.setState({ condition: 1, delta: 0, decision: 0 });
    }
  }

  restart(from, size) {
    this.setState({
      ...this.constrain(from, size, this.props),
      decision: 0,
      condition: 0,
    }, () => {
      if (this.shouldRemoveEvents === true) this.removeEvents();
    });
  }

  constrain(from, size, { length }) {
    const diff = this.props.length - from;
    const maxSize = size > diff ? diff : size;
    const fromIndex = Math.max(Math.min(from, length), 0);
    return { from: fromIndex, size: maxSize };
  }

  addEvents() {
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleMouseUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  removeEvents() {
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleMouseUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  handleTouchStart(pressX, i, e) {
    this.handleMouseDown(pressX, i, e.touches[0]);
  }

  handleTouchMove(e) {
    e.preventDefault();
    this.handleMouseMove(e.touches[0]);
  }

  handleMouseDown(pressX, i, { pageX }) {
    if (i === this.lastIndex) {
      this.shouldRemoveEvents = true;
    }
    this.setState({
      delta: pageX - pressX,
      mouse: pressX,
      condition: 2,
    });
  }

  handleMouseMove({ pageX }) {
    const { condition, delta } = this.state;
    if (condition === 2) this.setState({ mouse: pageX - delta });
  }

  handleMouseUp() {
    this.decide();
  }

  render() {
    const { cardRenderer, cardWidth, cardHeight } = this.props;
    const { from, size, condition } = this.state;
    const cards = [];
    const contStyles = { width: `${cardWidth}px`, height: `${cardHeight}px` };
    const cs = styles.card;
    for (let i = 0; i < size; i++) {
      cards.unshift({ key: `snkr-card-${from + i}`, index: i });
    }
    this.lastIndex = size - 1;
    return (
      <div className="ui-swipeable-cards">
        <div className="ui-swipeable-container" style={contStyles}>
          {cards.map(({ key, index }) =>
            <Motion
              style={this.animCard()}
              key={`ui-card-motion-${key}`}
            >
              {({ x, opacity }) =>
                <div
                  onMouseDown={this.handleMouseDown.bind(null, x, index)}
                  onTouchStart={this.handleTouchStart.bind(null, x, index)}
                  key={key}
                  className={`ui-swipeable-card${condition !== 0 ? '' : ' ui-transition'}`}
                  style={index === 0 ? this.getCardStyles(x, opacity) : cs[`st${index}`]}
                >
                  {cardRenderer(from + index, index)}
                </div>
              }
            </Motion>
          )}
        </div>
        <button style={styles.nextButton} onClick={() => { console.log('>>> clicked!!!'); }}>
          Next
        </button>
      </div>
    );
  }

}

styles = {
  card: {
    st1: {
      transform: 'translate3d(0, 20px, 0) scale(0.95)',
      WebkitTransform: 'translate3d(0, 20px, 0) scale(0.95)',
    },
    st2: {
      transform: 'translate3d(0, 0px, 0) scale(0.9)',
      WebkitTransform: 'translate3d(0, 0px, 0) scale(0.9)',
    },
    st3: {
      transform: 'translate3d(0, -20px, 0) scale(0.85)',
      WebkitTransform: 'translate3d(0, -20px, 0) scale(0.85)',
    },
    st4: {
      transform: 'translate3d(0, -40px, 0) scale(0.8)',
      WebkitTransform: 'translate3d(0, -40px, 0) scale(0.8)',
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
