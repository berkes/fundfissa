import React from 'react';
import Banner from './Banner';
import Crowdfunder from './Crowdfunder';

class App extends React.Component {
  state = {
    loading: true,
    keys: {},
    purchase: () => {},
    txHash: null,
    txStatus: "",
    fundTotal: 0,
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

    // TODO: use drizzle and redux to manage and passthe state instead of web3
    const purchase = function(e) {
      e.preventDefault();

      let price = drizzle.store.getState().contracts.Fissa.ticketPrice["0x0"].value;

      drizzle.contracts.Fissa.methods.purchase().send({ value: price })
        .on('transactionHash', (hash) => {
          console.log("on transactionHash:", hash);
          this.setState({ txHash: hash, txStatus: "pending" });
        })
        .on('confirmation', (confirmationNumber, receipt) => {
          console.log(receipt);
          console.log("on confirmation:", confirmationNumber);
          this.setState({ txStatus: "confirmed" });
        })
        .on('error', (error) => {
          console.error("on Error:", error);
          this.setState({ txStatus: "failed" });
        })
    }.bind(this);

    drizzle.web3.eth.getBalance(contract.address).then((balance) => {
      this.setState({fundTotal: balance})
    })

    var keys = {};
    this.contractAttrs.forEach((name) => {
      keys[name] = contract.methods[name].cacheCall();
    });

    this.setState({
      contract: contract,
      keys: keys,
      purchase: purchase,
      fundTotal: 10000000,
    })
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
    const { contract, keys, purchase, fundTotal, txHash, txStatus } = this.state;

    var reader = {}
    this.contractAttrs.forEach((name) => {
      reader[name] = this.getContractVar(name, keys[name]);
    });
    var hasNullValues = Object.values(reader).some(v => (v === null));

    if (hasNullValues) {
      return <h1>loading contract</h1>
    } else {
      return(
        <React.Fragment>
          <Banner
            contract={contract}
            eventName={reader.eventName}
            startsAt={reader.startsAt}
          />
          <Crowdfunder
            purchase={purchase}
            eventName={reader.eventName}
            startsAt={reader.startsAt}
            ticketPrice={reader.ticketPrice}
            threshold={reader.threshold}
            fundTotal={fundTotal}
            txHash={txHash}
            txStatus={txStatus}
          />
        </React.Fragment>
      );
    }
  }
}

export default App;
