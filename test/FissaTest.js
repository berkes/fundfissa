const Fissa = artifacts.require("./Fissa.sol");
const { expect } = require('chai');
const { balance,
        BN,
        constants,
        ether,
        expectEvent,
        expectRevert,
        time } = require('openzeppelin-test-helpers');

contract("Fissa", accounts => {
  let eventName = "Huisfeest";
  let startsAt =  Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 5);
  let ticketPrice = ether('0.2');
  let threshold = ether('1.2'); //deliberately devidable by 0.2
  let roles = {
    organizer: accounts[0],
    buyer: accounts[1]
  }

  describe("deploy", () => {
    let fissa = null;

    before(async () => {
      fissa = await Fissa.new(
        eventName,
        startsAt,
        ticketPrice,
        threshold
      );
    });

    it("sets an eventName", async () => {
      const actualEventName = await fissa.eventName.call();
      assert.equal(actualEventName, eventName);
    });

    it("sets StartsAt", async () => {
      const actualStartsAt = await fissa.startsAt.call();
      assert.equal(actualStartsAt.toNumber(), startsAt);
    });

    it("sets a ticketPrice in wei", async () => {
      const actualTicketPrice = await fissa.ticketPrice.call();
      expect(actualTicketPrice).to.be.bignumber.equal(ticketPrice);
    });

    it("has a threshold", async () => {
      const actualThreshold = await fissa.threshold.call();
      expect(actualThreshold).to.be.bignumber.equal(threshold);
    });

    it('has a participants map', async () => {
      expect(await fissa.participants.call(constants.ZERO_ADDRESS)).
        to.be.bignumber.equal('0')
    });

    it('has a balances map', async () => {
      expect(await fissa.balances.call(constants.ZERO_ADDRESS)).
        to.be.bignumber.equal('0')
    });
  })

  describe('expired', async () => {
    let fissa = null;

    before(async () => {
      let latest = await time.latest()
      fissa = await Fissa.new(
        eventName,
        latest.add(time.duration.seconds(10)),
        ticketPrice,
        threshold
      );
      await time.increase(time.duration.seconds(12));
    });

    it('is expired', async () => {
      var startsAt = await fissa.startsAt.call();
      var blockTime = await time.latest();
      // This means the current timestamp has passed the startsAt
      expect(blockTime).to.be.bignumber.gt(startsAt);
    });

    it('reports to be expired', async () => {
      expect(await fissa.isExpired.call()).to.be.true
    })
  });

  describe('purchase', async () => {
    let fissa = null;

    before(async () => {
      fissa = await Fissa.new(
        eventName,
        startsAt,
        ticketPrice,
        threshold
      );
    });

    it('adds buyer to list of participants', async () => {
      await fissa.purchase({ from: roles.buyer, value: ticketPrice });
      expect(await fissa.participants(roles.buyer)).to.be.bignumber.equal('1');
    });

    it('increments buyer amount in participants', async () => {
      // We have 1 from previous testcase. Yes. This sucks ¯\_(ツ)_/¯.
      await fissa.purchase({ from: roles.buyer, value: ticketPrice });
      expect(await fissa.participants(roles.buyer)).to.be.bignumber.equal('2');
    });

    it('increments buyer balance', async () => {
      // We have 2 from previous testcase.
      await fissa.purchase({ from: roles.buyer, value: ticketPrice });
      expect(await fissa.balances(roles.buyer)).to.be.bignumber.equal((3 * ticketPrice).toString());
    });

    it('transfers ether from buyer into the contract', async () => {
      let buyerBalance = await balance.tracker(roles.buyer);
      let contractBalance = await balance.tracker(fissa.address);

      await fissa.purchase({ from: roles.buyer, value: ticketPrice });

      let gas = ether('0.001');
      expect(await buyerBalance.delta()).to.be.bignumber.closeTo(ticketPrice.neg(), gas);
      expect(await contractBalance.delta()).to.be.bignumber.equal(ticketPrice);
    });

    it('does not allow payments lower than ticketPrice', async () => {
      await expectRevert(
        fissa.purchase({ from: roles.buyer, value: ether('0.1') }),
        "TicketPriceMismatch"
      )
    });

    it('does not allow payments higher than ticketPrice', async () => {
      await expectRevert(
        fissa.purchase({ from: roles.buyer, value: ether('0.3') }),
        "TicketPriceMismatch"
      )
    });

    it('sends a Purchase event', async () => {
      const { logs } = await fissa.purchase({ from: roles.buyer, value: ticketPrice });
      expectEvent.inLogs(logs, 'Purchase', { purchaser: roles.buyer });
    });
  }); // purchase

  describe('isFunded', function () {
    let fissa = null;
    before(async () => {
      fissa = await Fissa.new(
        eventName,
        startsAt,
        ticketPrice,
        ticketPrice.muln(2) // Set threshold to ticketPrice so 2 purchases fund it.
      );
    });

    it('is false when threshold is not met', async () => {
      await fissa.purchase({ from: roles.buyer, value: ticketPrice });
      expect(await fissa.isFunded.call()).to.be.false
    });

    // NOTE: regardless of isExpired state!
    it('is true when threshold is met', async () => {
      await fissa.purchase({ from: roles.buyer, value: ticketPrice });
      expect(await fissa.isFunded.call()).to.be.true
    });
  }); // isFunded
});
