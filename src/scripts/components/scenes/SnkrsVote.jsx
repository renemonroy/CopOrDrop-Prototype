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

  getTruncation(h) {
    if (h < 350) {
      return 70;
    } else if (h < 420) {
      return 140;
    }
    return 210;
  }

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
    const { id, title, subtitle, assets, description } = this.snkrs[i];
    return (
      <div className="snkr-card-content" id={`snkr-${id}`}>
        <img src={assets.default} role="presentation" />
        <div className="pt3-sm pb3-sm prl4-sm u-align-center">
          <h6 className="ncss-brand text-color-grey">{subtitle}</h6>
          <h3 className="ncss-brand lh-h5 pb4-sm">{title}</h3>
          <p>{_.truncate(description, { length: this.truncateLength })}</p>
        </div>
      </div>
    );
  }

  renderBackground() {
    const snkr = this.snkrs[this.state.cardIndex] || this.snkrs[this.snkrs.lenght - 1];
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
    const cardHeight = (cardWidth / ratio) * 0.8;
    this.truncateLength = this.getTruncation(cardHeight);
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
