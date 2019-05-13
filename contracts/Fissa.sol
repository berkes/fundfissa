pragma solidity ^0.5.0;

contract Fissa {
  string public eventName; 

  constructor(string memory _eventName) public {
    eventName = _eventName;
  }

  function setName(string memory _eventName) public returns (bool) {
    eventName = _eventName;
    return true;
  }
}
