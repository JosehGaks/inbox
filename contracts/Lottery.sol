// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract Lottery {
    address public manager;
    address[] public players;

    constructor () public {
        manager = msg.sender;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function enter() public payable {
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }

    function random() private view returns(uint) {
        return uint(keccak256(abi.encodePacked(block.prevrandao,block.timestamp,players)));
    }

    function pickWinner() public restricted payable {
        uint index = random() % players.length;
        payable(players[index]).transfer(address(this).balance);
        players = new address[](0);
    }

    function getPlayers() public view returns(address[] memory) {
        return players;
    }
}