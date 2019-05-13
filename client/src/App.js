import React from 'react';
import Banner from './Banner';

class App extends React.Component {
  state = {
    loading: true,
    drizzleState: null
  }

  componentDidMount() {
    const { drizzle } = this.props;

    this.unsubscribe = drizzle.store.subscribe(() => {
      // Wait for the store to become ready, then update local component
      const drizzleState = drizzle.store.getState();
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({
          loading: false,
          drizzleState:  drizzleState,
        });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    if (this.state.loading) return "Loading blockchain...";
    return(
      <Banner
        drizzle={this.props.drizzle}
        drizzleState={this.state.drizzleState}
      />
    );
//ReactDOM.render(<Crowdfunder drizzle={drizzle} />, document.getElementById('crowdfunder'));
  }
}

export default App;
