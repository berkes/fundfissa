import React from 'react';
import { utils } from 'web3';
import moment from 'moment';

class Crowdfunder extends React.Component { 
  static defaultProps = {
    startsAt: 0,
    eventName: "",
    ticketPrice: 0,
    threshold: 0,

    fundTotal: 0,
    percentage: 0,
    ticketsLeft: 0,
  }

  constructor(props) {
    super(props);
    var startsAtDate = moment.unix(props.startsAt);
    var timeLeft = startsAtDate.toNow();
    // TODO: use contract locked checker instead.
    var isLocked = moment().isAfter(startsAtDate);

    this.state = { 
      ticketPriceEth: utils.fromWei(props.ticketPrice),
      thresholdEth: utils.fromWei(props.threshold),
      ticketsLeft: Math.floor(props.threshold / props.ticketPrice),
      timeLeft: timeLeft,
      isLocked: isLocked
    }
  }

  render() {
    const { startsAt, eventName, fundTotal } = this.props;
    const { ticketPriceEth, thresholdEth, timeLeft, isLocked, ticketsLeft } = this.state;

    return(
      <section id="form" className="facilities-area section-gap"><div className="container"><div className="row align-items-center justify-content-center"><div className="col-md-8 pb-80 header-text">
        <h1>
          <span className="lnr lnr-rocket"></span>&nbsp;
          ETH {fundTotal} of ETH {Number.parseFloat(thresholdEth).toFixed(2)} funded
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
             (<button className="nw-btn primary-btn">Download Ticket <span className="lnr lnr-download"></span></button>) :
             (<button className="nw-btn primary-btn">
                Buy your ticket for <strong>Ξ{ticketPriceEth}</strong>
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
