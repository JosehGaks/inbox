const path = require("path");
const fs = require("fs");
const solc = require("solc");

const inboxPath = path.resolve(__dirname, "contracts", "Inbox.sol");
const source = fs.readFileSync(inboxPath, "utf-8");

// console.log(JSON.parse(solc.compile(source)));

const input = {
  language: "Solidity",
  sources: {
    "Inbox.sol": {
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

// `output` here contains the JSON output as specified in the documentation
// for (const contractName in output.contracts["Inbox.sol"]) {
//   console.log(
//     contractName +
//       ": " +
//       output.contracts["Inbox.sol"][contractName].evm.bytecode.object
//   );
// }
module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "Inbox.sol"
];
