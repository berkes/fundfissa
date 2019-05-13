import React from 'react';

class Banner extends React.Component {
  state = {
    loading: true,
    startsAt: 0,
    remaining: null,
  }

  componentDidMount() {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.Fissa;
    const eventNameKey = contract.methods["eventName"].cacheCall();

    // TODO: replace with new Date(contract.eventStartsAt * 1000)
    // date --date="2019-06-06 22:00" +%s
    var startsAt = new Date(1559851200 * 1000);

    this.setState({
      loading: false,
      remaining: this.getTimeRemaining(startsAt),
      startsAt: startsAt,
      eventNameKey: eventNameKey
    });

    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    this.unsubscribe();
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({ remaining: this.getTimeRemaining(this.state.startsAt) })
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

  getContractVar(name, key) {
    const { Fissa } = this.props.drizzleState.contracts;
    console.log(Fissa);
    if (Fissa[name] && Fissa[name][key]) {
      return Fissa[name][key].value;
    } else {
      return "";
    }
  }

  render() {
    if(this.state.loading) return(<h1>Loading Blockchain...</h1>);

    // store var in a shortcut to avoid having to type this.state everytime
    const remaining = this.state.remaining;
    const eventName = this.getContractVar("eventName", this.state.eventNameKey)

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
