// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract Inbox {
    string private  message;

    constructor(string memory newMessage) public {
        message = newMessage;
    }

    function setMessage(string memory newMessage) public payable {
        message = newMessage;
    }

    function getMessage() public view returns (string memory) {
        return message;
    }

}