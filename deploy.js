const HDWalletProvider = require("@truffle/hdwallet-provider");
const { Web3 } = require("web3"); //  web3.js has native ESM builds and (`import Web3 from 'web3'`)
const fs = require("fs");
const path = require("path");

// Read the bytecode from the file system
const bytecodePath = path.join(__dirname, "./InboxBytecode.bin");
const bytecode = fs.readFileSync(bytecodePath, "utf-8");

// abi
const abi = require("./InboxContractAbi.json");

const provider = new HDWalletProvider(
  process.env.METAMASK_PHRASE,
  "https://sepolia.infura.io/v3/9d13a50a3a564fc8b5210dcfb4740081"
);

const web3 = new Web3(provider);
const MyContract = new web3.eth.Contract(abi);

async function deploy() {
  const providersAccounts = await web3.eth.getAccounts();
  const defaultAccount = providersAccounts[0];
  console.log("deployer account:", defaultAccount);

  const myContract = MyContract.deploy({
    data: "0x" + bytecode,
    arguments: ["Hello World!"],
  });

  // optionally, estimate the gas that will be used for development and log it
  const gas = await myContract.estimateGas({
    from: defaultAccount,
  });
  console.log("estimated gas:", gas);

  try {
    // Deploy the contract to the Ganache network
    const tx = await myContract.send({
      from: defaultAccount,
      gas,
      gasPrice: 10000000000,
    });
    console.log("Contract deployed at address: " + tx.options.address);

    // Write the Contract address to a new file
    const deployedAddressPath = path.join(__dirname, "MyContractAddress.bin");
    fs.writeFileSync(deployedAddressPath, tx.options.address);
  } catch (error) {
    console.error(error);
  }
}

deploy();
