pragma solidity ^0.5.7;

contract Fissa {
  string public eventName = ""; 
  uint public startsAt = 0;
  uint public ticketPrice = 0;
  uint public threshold = 0;
  address public organizer;

  // @dev: we have a severe security issue here, if we don't explicitely
  //       check the uint8 size on setting it.
  mapping(address => uint) private _balances;

  event Purchase(address purchaser);

  constructor(string memory _eventName,
              uint _startsAt,
              uint _ticketPrice,
              uint _threshold) public {
    eventName = _eventName;
    startsAt = _startsAt;
    ticketPrice = _ticketPrice;
    threshold = _threshold;
    organizer = msg.sender;
  }

  function isExpired() public view returns(bool) {
    return startsAt < now;
  }

  function isFunded() public view returns(bool) {
    return address(this).balance >= threshold;
  }

  function participants(address participant) public view returns(uint) {
    return _balances[participant] / ticketPrice;
  }

  function balances(address participant) public view returns(uint) {
    if (participant == organizer) {
      return address(this).balance;
    }
    else {
      return _balances[participant];
    }
  }

  function purchase() public payable {
    require(msg.value == ticketPrice, "TicketPriceMismatch");
    require(! isExpired(), "Expired");

    _balances[msg.sender] += msg.value;
    emit Purchase(msg.sender);
  }

  function withdraw(uint _amount) public {
    require(isExpired(), "NotExpired");

    if (!(msg.sender == organizer)) {
      require(_balances[msg.sender] >= _amount, "InsufficientBalance");
    }

    _balances[msg.sender] -= _amount;

    msg.sender.transfer(_amount);
  }
}
