const path = require("path");
const fs = require("fs");
const solc = require("solc");

// console.log(JSON.parse(solc.compile(source)));
const fileName = "Inbox.sol";
const contractName = "Inbox";

const inboxPath = path.resolve(__dirname, "contracts", fileName);
const source = fs.readFileSync(inboxPath, "utf-8");

const input = {
  language: "Solidity",
  sources: {
    [fileName]: {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const compiledCode = JSON.parse(solc.compile(JSON.stringify(input)));
const bytecode =
  compiledCode.contracts[fileName][contractName].evm.bytecode.object;

const bytecodePath = path.join(__dirname, "InboxBytecode.bin");
fs.writeFileSync(bytecodePath, bytecode);

const abi = compiledCode.contracts[fileName][contractName].abi;
const abiPath = path.join(__dirname, "InboxContractAbi.json");
fs.writeFileSync(abiPath, JSON.stringify(abi, null, "\t"));

// `output` here contains the JSON output as specified in the documentation
// for (const contractName in output.contracts["Inbox.sol"]) {
//   console.log(
//     contractName +
//       ": " +
//       output.contracts["Inbox.sol"][contractName].evm.bytecode.object
//   );
// }
// module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
//   "Inbox.sol"
// ]["Inbox.sol"].evm;

module.exports = { abi, bytecode };
