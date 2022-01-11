//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./interfaces/ISPT.sol";

struct ChatMessage {
    address addr;
    string message;
}

contract Chatter {
    ChatMessage[] private chatMessages;

    IERC20 public immutable SPT;

    address private deployersAddr;

    constructor(
        string memory _message,
        address _sptAddr,
        address _deployersAddr
    ) {
        SPT = ISPT(_sptAddr);
        deployersAddr = _deployersAddr;
        console.log("Deploying a Chatter with message:", _message);
        chatMessages.push(ChatMessage(msg.sender, _message));
    }

    function latestMessage() public view returns (ChatMessage memory) {
        return chatMessages[chatMessages.length - 1];
    }

    function allMessages() public view returns (ChatMessage[] memory) {
        return chatMessages;
    }

    function addMessage(string memory _meesage) public {
        require(SPT.balanceOf(msg.sender) > 1 * (10**18), "Insufficient funds");
        SPT.transferFrom(msg.sender, deployersAddr, 1 * (10**18));
        console.log("Adding new message message - '%s'", _meesage);
        chatMessages.push(ChatMessage(msg.sender, _meesage));
    }
}
