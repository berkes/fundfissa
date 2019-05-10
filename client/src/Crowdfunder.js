import React from 'react';
import moment from 'moment';

class Crowdfunder extends React.Component { 
  constructor(props) {
    super(props);

    const deadline = moment.unix(1559851200);

    // TODO: replace with actual contract values
    this.state = {
      fundTotal: 24,
      threshold: 1337,
      percentage: Math.floor((24 / 1337) * 100),
      deadline: deadline,
      ticketPrice: 12,
      timeLeft: moment(deadline).toNow(true),
      ticketsLeft: Math.ceil(1337/12) - (24/12),
      isLocked: false,
    }
  }

  render() {
    return(
      <div className="col-md-8 pb-80 header-text">
        <h1>
          <span className="lnr lnr-rocket"></span>&nbsp;
          Ξ{this.state.fundTotal} of Ξ{this.state.threshold} funded
        </h1>
        <p>
          <span className="lnr lnr-hourglass"></span>&nbsp;
          Less than <strong>{this.state.timeLeft} left</strong> to fund this fissa!
        </p>
        <p>
          <br/>
          { this.state.isLocked ?
             (<button className="nw-btn primary-btn">Download Ticket <span className="lnr lnr-download"></span></button>) :
             (<button className="nw-btn primary-btn">
                Buy your ticket for <strong>Ξ{this.state.ticketPrice}</strong>
                <span className="lnr lnr-cart"></span>
              </button>)
          }
        </p>
        <p>
          Only {this.state.ticketsLeft} tickets left!
        </p>
      </div>
    )
  }
}

export default Crowdfunder
