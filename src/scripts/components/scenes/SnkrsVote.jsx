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

  discardCard(i) {
    console.log('>>> Snkr discarded:', this.snkrs[i]);
  }

  acceptCard(i) {
    console.log('>>> Snkr accepted:', this.snkrs[i]);
  }

  renderCard(i) {
    const { id, title } = this.snkrs[i];
    return (
      <div className="snkr-card-content" id={`snkr-${id}`}>
        <p>{title}</p>
      </div>
    );
  }

  render() {
    const { snkrs } = this.props;
    const ratio = window.innerWidth / window.innerHeight;
    const cardWidth = window.innerWidth - 40; // 20px of padding in both sides
    const cardHeight = (cardWidth / ratio) * 0.75;
    this.snkrs = _.map(snkrs, (val, k) => ({ ...val, id: parseInt(k, 10) }));
    return (
      <section>
        <p>Vote</p>
        <UISwipeableCards
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          length={this.snkrs.length}
          stackSize={4}
          onDiscard={::this.discardCard}
          onAccept={::this.acceptCard}
          cardRenderer={::this.renderCard}
        />
      </section>
    );
  }

}

export default SnkrsVoteScene;
