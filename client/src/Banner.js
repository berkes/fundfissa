import React from 'react';
import moment from 'moment';

// Component renders the banner with the ticking clock.
// Maintains state only for the clock.
class Banner extends React.Component {
  static defaultProps = {
    startsAt: 0,
    eventName: "",
    remaining: { 
      'total': 0,
      'days': 0,
      'hours': 0,
      'minutes': 0,
      'seconds': 0
    }
  }

  constructor(props) {
    super(props)
    this.state = { remaining: this.getTimeRemaining(this.props.startsAt)  }
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({ remaining: this.getTimeRemaining(this.props.startsAt) })
  }

  getTimeRemaining(endtime) {
    var now = moment(new Date());
    var end = moment.unix(endtime);
    if (end.isSameOrAfter(now)) {
      return this.props.remaining;
    }
    var remaining = moment.duration(now.diff(end));
    return {
      'total': remaining,
      'days': remaining.days(),
      'hours': remaining.hours(),
      'minutes': remaining.minutes(),
      'seconds': remaining.seconds()
    };
  }

  render() {
    const { remaining } = this.state;
    const { eventName } = this.props;

    return(
    <section className="banner-area relative" id="home">
      <div className="overlay overlay-bg"></div>
      <div className="container">
        <div className="row fullscreen align-items-center justify-content-center">
          <div className="banner-content col-lg-6 col-md-12" id="banner">
            <h1>
            <strong>{eventName}</strong> starts in
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
        </div>
      </div>
    </section>
    );
  }
}

export default Banner;
