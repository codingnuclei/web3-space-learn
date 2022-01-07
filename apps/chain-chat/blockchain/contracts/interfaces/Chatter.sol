//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct ChatMessage {
    address addr;
    string message;
}

interface IChatter {
    function latestMessage() external view returns (ChatMessage memory);

    function allMessages() external view returns (ChatMessage[] memory);

    function addMessage() external;
}
