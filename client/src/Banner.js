import React from 'react';

class Banner extends React.Component {
  constructor(props) {
    super(props);

    // TODO: replace with new Date(contract.eventStartsAt * 1000)
    // date --date="2019-06-06 22:00" +%s
    var startsAt = new Date(1559851200 * 1000);

    this.state = {
      eventName: "Fissa Zonder Naam", //TODO: eventName from contract
      startsAt: startsAt,
      remaining: this.getTimeRemaining(startsAt),
    }
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    )
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      remaining: this.getTimeRemaining(this.state.startsAt)
    })
  }

  getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor((t / 1000) % 60);
    var minutes = Math.floor((t / 1000 / 60) % 60);
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    var days = Math.floor(t / (1000 * 60 * 60 * 24));
    return {
      'total': t,
      'days': days,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    };
  }

  render() {
    // shortcut
    const remaining = this.state.remaining;

    return(
      <div className="banner-content col-lg-6 col-md-12" id="banner">
        <h1>
        {this.state.eventName} Starts in
        </h1>
        <div className="row clock_sec d-flex flex-row justify-content-between" id="clockdiv">
          <div className="clockinner">
            <span className="days">{remaining.days}</span>
            <div className="smalltext">Days</div>
          </div>
          <div className="clockinner">
            <span className="hours">{remaining.hours}</span>
            <div className="smalltext">Hours</div>
          </div>
          <div className="clockinner">
            <span className="minutes">{remaining.minutes}</span>
            <div className="smalltext">Minutes</div>
          </div>
          <div className="clockinner">
            <span className="seconds">{remaining.seconds}</span>
            <div className="smalltext">Seconds</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Banner;
