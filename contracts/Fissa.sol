pragma solidity ^0.5.7;

contract Fissa {
  string public eventName = ""; 
  uint public startsAt = 0;
  uint public ticketPrice = 0;
  uint public threshold = 0;

  // @dev: we have a severe security issue here, if we don't explicitely
  //       check the uint8 size on setting it.
  mapping(address => uint) public balances;

  event Purchase(address purchaser);

  constructor(string memory _eventName,
              uint _startsAt,
              uint _ticketPrice,
              uint _threshold) public {
    eventName = _eventName;
    startsAt = _startsAt;
    ticketPrice = _ticketPrice;
    threshold = _threshold;
  }

  function isExpired() public view returns(bool) {
    return startsAt < now;
  }

  function isFunded() public view returns(bool) {
    return address(this).balance >= threshold;
  }

  function participants(address participant) public view returns(uint) {
    return balances[participant] / ticketPrice;
  }

  function purchase() public payable {
    require(msg.value == ticketPrice, "TicketPriceMismatch");
    require(! isExpired(), "Expired");

    balances[msg.sender] += msg.value;
    emit Purchase(msg.sender);
  }
}
