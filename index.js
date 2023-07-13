const { Web3 } = require("web3");
const ganache = require("ganache");

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

web3.eth
  .getBlockNumber()
  .then((result) => console.log("Current block number: " + result))
  .catch((err) => console.error(err));
