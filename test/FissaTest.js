const Fissa = artifacts.require("./Fissa.sol");
const { expect } = require('chai');
const { BN,
        constants,
        expectEvent,
        expectRevert,
        time } = require('openzeppelin-test-helpers');

contract("Fissa", accounts => {
  let eventName = "Huisfeest";
  let startsAt =  Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 5);
  let ticketPriceInEth = 0.2;
  let thresholdInEth = 1.2; //deliberately devidable by 0.2

  describe("deploy", () => {
    let fissa = null;

    before(async () => {
      fissa = await Fissa.new(
        eventName,
        startsAt,
        web3.utils.toWei(ticketPriceInEth.toString()),
        web3.utils.toWei(thresholdInEth.toString())
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
      assert.equal(web3.utils.fromWei(actualTicketPrice), ticketPriceInEth);
    })

    it("has a threshold", async () => {
      const actualThreshold = await fissa.threshold.call();
      assert.equal(web3.utils.fromWei(actualThreshold), thresholdInEth);
    })
  })

  describe('expired', async () => {
    let fissa = null;

    before(async () => {
      let latest = await time.latest()
      fissa = await Fissa.new(
        eventName,
        latest.add(time.duration.seconds(10)),
        web3.utils.toWei(ticketPriceInEth.toString()),
        web3.utils.toWei(thresholdInEth.toString())
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
});
