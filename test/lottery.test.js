const assert = require("assert");
const fs = require("fs");
const { readFileSync } = require("fs");
const path = require("path");
// const ganache = require("ganache-cli");
// const { abi, bytecode } = require("../compile");
const { Web3 } = require("web3");

// set up new connection with the etherium network
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
web3.eth.Contract.handleRevert = true;

// Read the bytecode from the file system
const bytecodePath = path.join(__dirname, "../LotteryBytecode.bin");
const bytecode = readFileSync(bytecodePath, "utf-8");

// abi
const abi = require("../LotteryContractAbi.json");

let accounts;
let tx;
beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  const defaultAccount = accounts[0];
  const inbox = new web3.eth.Contract(abi).deploy({ data: "0x" + bytecode });
  const gas = await inbox.estimateGas({
    from: defaultAccount,
  });

  try {
    // create new contract object using the ABI bytecode.
    tx = await inbox.send({
      from: defaultAccount,
      gas,
      gasPrice: 10000000000,
    });
    const deployedAddressPath = path.join(__dirname, "LotteryAddress.bin");
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
describe("Lottery", () => {
  it("Deploys a contract", () => {
    assert.ok(tx.options.address);
  });

  it("User enters a Lottery", async () => {
    await tx.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei(0.02, "ether"),
    });
    await tx.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei(0.02, "ether"),
    });
    const players = await tx.methods.getPlayers().call({
      from: accounts[0],
    });
    assert.equal(accounts[1], players[0]);
    assert.equal(accounts[2], players[1]);
    assert.equal(2, players.length);
  });

  //   it("generates a random number ", async () => {
  //     const random = await tx.methods.random().call({
  //       from: accounts[0],
  //     });
  //     assert.equal(true, typeof random === "number");
  //     assert.equal(true, random > 0);
  //   });
  it("requires a minimum amount of ether to enter.", async () => {
    try {
      await tx.methods.enter().send({
        from: accounts[1],
        value: web3.utils.toWei(0.0001, "ether"),
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("Only the manager should pick a winner", async () => {
    try {
      await tx.methods.pickWinner().send({
        from: accounts[1],
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("picks a winner", async () => {
    await tx.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei(2, "ether"),
    });
    const initial_balance = await web3.eth.getBalance(accounts[1]);

    await tx.methods.pickWinner().send({
      from: accounts[0],
    });
    const balance = await web3.eth.getBalance(accounts[1]);
    const difference = balance - initial_balance;

    assert(difference > web3.utils.toWei(1.6, "ether"));
  });

  //   it("gets players", async () => {
  //     await tx.methods.enter().send({
  //       from: accounts[1],
  //     });
  //     await tx.methods.enter().send({
  //       from: accounts[2],
  //     });
  //     const players = await tx.methods.getPlayers().call();
  //     assert.equal(2, players.length);
  //   });
});
