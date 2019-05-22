import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

//import Banner from './Banner';
//import Crowdfunder from './Crowdfunder';

import * as serviceWorker from './serviceWorker';

// import drizzle functions and contract artifact
import { Drizzle, generateStore } from 'drizzle';
import { DrizzleContext } from 'drizzle-react';

import Fissa from "./contracts/Fissa.json";

// let drizzle know what contracts we want and how to access our test blockchain
const options = {
  contracts: [Fissa],
  web3: {
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:9545",
    },
  },
};

// setup drizzle instance
const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);

ReactDOM.render(
  <DrizzleContext.Provider drizzle={drizzle}>
    <DrizzleContext.Consumer>
      { drizzleContext => {
        const { drizzle, drizzleState, initialized } = drizzleContext;

        if (!initialized) {
          return "Loading... ";
        } else {
          return <App drizzle={drizzle} drizzleState={drizzleState} />;
        }
      }}
    </DrizzleContext.Consumer>
  </DrizzleContext.Provider>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
