const path = require("path");
const fs = require("fs");
const solc = require("solc");

// console.log(JSON.parse(solc.compile(source)));
const fileName = "Lottery.sol";
const contractName = "Lottery";

const lotteryPath = path.resolve(__dirname, "contracts", fileName);
const source = fs.readFileSync(lotteryPath, "utf-8");

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

const bytecodePath = path.join(__dirname, "LotteryBytecode.bin");
fs.writeFileSync(bytecodePath, bytecode);

const abi = compiledCode.contracts[fileName][contractName].abi;
const abiPath = path.join(__dirname, "LotteryContractAbi.json");
fs.writeFileSync(abiPath, JSON.stringify(abi, null, "\t"));
