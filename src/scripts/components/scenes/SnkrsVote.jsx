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
    this.snkrs = _.map(snkrs, (val, k) => ({ ...val, id: parseInt(k, 10) }));
    return (
      <section>
        <p>Vote</p>
        <UISwipeableCards
          cardRenderer={::this.renderCard}
          length={this.snkrs.length}
          stackSize={4}
          onDiscard={::this.discardCard}
          onAccept={::this.acceptCard}
        />
      </section>
    );
  }

}

export default SnkrsVoteScene;
