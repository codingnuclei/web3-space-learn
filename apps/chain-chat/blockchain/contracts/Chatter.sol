//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import 'hardhat/console.sol';

struct ChatMessage {
  address addr;
  string message;
}

contract Chatter {
  ChatMessage[] private chatMessages;

  constructor(string memory _message) {
    console.log('Deploying a Chatter with message:', _message);
    chatMessages.push(ChatMessage(msg.sender, _message));
  }

  function latestMessage() public view returns (ChatMessage memory) {
    return chatMessages[chatMessages.length - 1];
  }

  function allMessages() public view returns (ChatMessage[] memory) {
    return chatMessages;
  }

  function addMessage(string memory _meesage) public {
    console.log("Adding new chate message - '%s'", _meesage);
    chatMessages.push(ChatMessage(msg.sender, _meesage));
  }
}
