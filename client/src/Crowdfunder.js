import React from 'react';
import { utils } from 'web3';
import moment from 'moment';

import TransactionReport from './TransactionReport'

class Crowdfunder extends React.Component { 
  static defaultProps = {
    purchase: () => {},
    startsAt: 0,
    eventName: "",
    ticketPrice: '0',
    threshold: '0',
    fundTotal: '0',

    txHash: null,
    txStatus: "",
  }

  constructor(props) {
    super(props);
    var startsAtDate = moment.unix(props.startsAt);
    var timeLeft = startsAtDate.fromNow();
    // TODO: use contract locked checker instead.
    var isLocked = moment().isAfter(startsAtDate);

    // TODO: ask contract instead
    var ticketsLeft = Math.ceil((props.threshold - props.fundTotal) / props.ticketPrice);

    this.state = { 
      ticketPriceEth: utils.fromWei(props.ticketPrice),
      thresholdEth: utils.fromWei(props.threshold),
      fundTotalEth: utils.fromWei(props.fundTotal),
      ticketsLeft: ticketsLeft,
      timeLeft: timeLeft,
      isLocked: isLocked
    }
  }

  render() {
    const { purchase, txHash, txStatus  } = this.props;
    const { ticketPriceEth, thresholdEth, timeLeft, isLocked, fundTotalEth, ticketsLeft } = this.state;

    return(
      <section id="form" className="facilities-area section-gap"><div className="container"><div className="row align-items-center justify-content-center"><div className="col-md-8 pb-80 header-text">
        <TransactionReport txHash={txHash} txStatus={txStatus} />
        <h1>
          <span className="lnr lnr-rocket"></span>&nbsp;
          ETH {Number.parseFloat(fundTotalEth).toFixed(2)} of ETH {Number.parseFloat(thresholdEth).toFixed(2)} funded
        </h1>
        <p>
          <span className="lnr lnr-hourglass"></span>&nbsp;
          { isLocked ?
            (<strong>Time is up!</strong>) :
            (<span>Less than <strong>{timeLeft}</strong> left to fund this fissa!</span>)
          }
        </p>
        <p>
          <br/>
          { isLocked ?
             (<button className="nw-btn primary-btn">
                Download Ticket
                <span className="lnr lnr-download"></span>
              </button>) :
             (<button onClick={purchase} className="nw-btn primary-btn">
                Buy your ticket for <strong>ETH {Number.parseFloat(ticketPriceEth).toFixed(2)}</strong>
                <span className="lnr lnr-cart"></span>
              </button>)
          }
        </p>
        <p>
          {ticketsLeft} tickets left!
        </p>
      </div></div></div></section>
    )
  }
}

export default Crowdfunder
