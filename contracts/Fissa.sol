pragma solidity ^0.5.7;

contract Fissa {
  string public eventName = ""; 
  uint public startsAt = 0;
  uint public ticketPrice = 0;
  uint public threshold = 0;

  constructor(string memory _eventName,
              uint _startsAt,
              uint _ticketPrice,
              uint _threshold) public {
    eventName = _eventName;
    startsAt = _startsAt;
    ticketPrice = _ticketPrice;
    threshold = _threshold;
  }
}
