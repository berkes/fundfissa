import React from 'react';
import Banner from './Banner';

class App extends React.Component {
  state = {
    loading: true,
    eventNameKey: "",
    startsAtKey: "",
  }

  //new Date(1559851200 * 1000),

  componentDidMount() {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.Fissa;

    const eventNameKey = contract.methods["eventName"].cacheCall();
    const startsAtKey = contract.methods["startsAt"].cacheCall();
    this.setState({ eventNameKey, startsAtKey })
  }

  getContractVar(name, key) {
    const { Fissa } = this.props.drizzleState.contracts;
    if (Fissa[name] && Fissa[name][key]) {
      return Fissa[name][key].value;
    } else {
      return "";
    }
  }

  render() {
    var eventName = this.getContractVar("eventName", this.state.eventNameKey)
    var startsAt = this.getContractVar("startsAt", this.state.startsAtKey)
    if (startsAt && eventName) {
      return(
        <Banner
          eventName={eventName}
          startsAt={startsAt}
        />
      );
    } else {
      console.log(startsAt, eventName)
      return <h1>loading contract</h1>
    }
  }
}

export default App;
