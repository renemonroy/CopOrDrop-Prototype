import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { UISwipeableCards } from '../ui';
import { connect } from 'react-redux';

@connect(state => ({
  snkrs: state.Snkrs.toJS(),
}))
class SnkrsVoteScene extends Component {

  static displayName = 'SnkrsVoteScene';

  static propTypes = {
    snkrs: PropTypes.object.isRequired,
  };

  static defaultProps = {
    snkrs: {},
  }

  state = {
    cardIndex: 0,
  };

  discardCard(i) {
    console.log('>>> Snkr discarded:', this.snkrs[i]);
  }

  acceptCard(i) {
    console.log('>>> Snkr accepted:', this.snkrs[i]);
  }

  handleChange(i) {
    this.setState({ cardIndex: i });
  }

  renderCard(i) {
    const { id, title, assets } = this.snkrs[i];
    return (
      <div className="snkr-card-content" id={`snkr-${id}`}>
        <img src={assets.default} role="presentation" />
        <p>{title}</p>
      </div>
    );
  }

  renderBackground() {
    const snkr = this.snkrs[this.state.cardIndex];
    const bgStyl = {
      backgroundImage: `url('${snkr.assets.default}')`,
    };
    return (
      <div className="snkrs-vote-bg" style={bgStyl}>
        <div className="snkrs-vote-overlay"></div>
      </div>
    );
  }

  render() {
    const { snkrs } = this.props;
    const ratio = window.innerWidth / window.innerHeight;
    const cardWidth = window.innerWidth - 80; // 20px of padding in both sides
    const cardHeight = (cardWidth / ratio) * 0.65;
    this.snkrs = _.map(snkrs, (val, k) => ({ ...val, id: parseInt(k, 10) }));
    return (
      <section className="snkrs-vote-scene">
        <p>Vote</p>
        {this.snkrs.length > 0 ? this.renderBackground() : null}
        <UISwipeableCards
          cardRenderer={::this.renderCard}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          length={this.snkrs.length}
          stackSize={4}
          onDiscard={::this.discardCard}
          onAccept={::this.acceptCard}
          onChange={::this.handleChange}
        />
      </section>
    );
  }

}

export default SnkrsVoteScene;
