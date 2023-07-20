const assert = require("assert");
const fs = require("fs");
const { readFileSync } = require("fs");
const path = require("path");
const { Web3 } = require("web3");

// set up new connection with the etherium network
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
web3.eth.Contract.handleRevert = true;

// Read the bytecode from the file system
const bytecodePath = path.join(__dirname, "../InboxBytecode.bin");
const bytecode = readFileSync(bytecodePath, "utf-8");

// abi
const abi = require("../InboxContractAbi.json");
const INITIAL_ARGUMENT = "Hi there!";

let accounts;
let tx;
beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  const defaultAccount = accounts[0];
  const inbox = new web3.eth.Contract(abi).deploy({
    data: "0x" + bytecode,
    arguments: [INITIAL_ARGUMENT],
  });
  const gas = await inbox.estimateGas({
    from: defaultAccount,
  });

  try {
    tx = await inbox.send({
      from: defaultAccount,
      gas,
      gasPrice: 10000000000,
    });
    const deployedAddressPath = path.join(__dirname, "InboxAddress.bin");
    fs.writeFileSync(deployedAddressPath, tx.options.address);
    // ...
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
  //
});

// tests
// start here
// ...

describe("Inbox", () => {
  it("Deploys a contract", () => {
    assert.ok(tx.options.address);
  });

  it("Has a default message", async () => {
    const message = await tx.methods.getMessage().call();
    assert.equal(message, INITIAL_ARGUMENT);
  });

  it("Can change the message", async () => {
    const newMessage = "Am good!";
    await tx.methods.setMessage(newMessage).send({
      from: accounts[0],
    });
    const message = await tx.methods.getMessage().call();
    assert.equal(message, newMessage);
  });
});
