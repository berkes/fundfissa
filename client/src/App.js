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
      console.log(drizzle);

    // TODO: use drizzle and redux to manage and passthe state instead of web3
    const purchase = function(e) {
      e.preventDefault();

      const web3 = drizzle.web3;
      const price = state.contracts.Fissa.ticketPrice["0x0"].value;
      const purchaseId = contract.methods.purchase.cacheSend({ value: price });
      console.log(price);
      if (state.transactionStack[purchaseId]) {
        const txHash = state.transactionStack[purchaseId];
        const txStatus = state.transactions[txHash].status;
        console.log(txHash, txStatus);
        this.setState({ txHash, txStatus });
      }
    }

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
    const { contract, keys, purchase, fundTotal } = this.state;

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
          />
        </React.Fragment>
      );
    }
  }
}

export default App;
