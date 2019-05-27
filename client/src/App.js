import React from 'react';
import Banner from './Banner';
import Crowdfunder from './Crowdfunder';

class App extends React.Component {
  state = {
    loading: true,
    keys: {},
  }

  contractAttrs = [
    "eventName",
    "startsAt",
    "ticketPrice",
    "threshold",
  ]

  componentDidMount() {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.Fissa;
    var keys = {};

    this.contractAttrs.forEach((name) => {
      keys[name] = contract.methods[name].cacheCall();
    });
    this.setState({ keys: keys })
  }

  getContractVar(name, key) {
    const { Fissa } = this.props.drizzleState.contracts;
    if (Fissa[name] && Fissa[name][key]) {
      return Fissa[name][key].value;
    } else {
      return null;
    }
  }

  render() {
    var reader = {}

    this.contractAttrs.forEach((name) => {
      reader[name] = this.getContractVar(name, this.state.keys[name]);
    });
    var hasNullValues = Object.values(reader).some(v => (v === null));

    if (hasNullValues) {
      return <h1>loading contract</h1>
    } else {
      return(
        <React.Fragment>
          <Banner
            eventName={reader.eventName}
            startsAt={reader.startsAt}
          />
          <Crowdfunder
            eventName={reader.eventName}
            startsAt={reader.startsAt}
            ticketPrice={reader.ticketPrice}
            threshold={reader.threshold}
          />
        </React.Fragment>
      );
    }
  }
}

export default App;
