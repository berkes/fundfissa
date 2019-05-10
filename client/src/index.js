import React from 'react';
import ReactDOM from 'react-dom';

import Banner from './Banner';
import Crowdfunder from './Crowdfunder';

import * as serviceWorker from './serviceWorker';

// import drizzle functions and contract artifact
import { Drizzle } from "drizzle";
//import MyStringStore from "./contracts/MyStringStore.json";


// let drizzle know what contracts we want and how to access our test blockchain
//const options = {
  //contracts: [MyStringStore],
  //web3: {
    //fallback: {
      //type: "ws",
      //url: "ws://127.0.0.1:9545",
    //},
  //},
//};

// setup drizzle
//const drizzle = new Drizzle(options);
const drizzle = null;

ReactDOM.render(<Banner drizzle={drizzle} />, document.getElementById('banner'));
ReactDOM.render(<Crowdfunder drizzle={drizzle} />, document.getElementById('crowdfunder'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
