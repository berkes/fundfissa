const Fissa = artifacts.require("./Fissa.sol");

contract("Fissa", accounts => {
  describe("deploy", () => {
    let fissa = null;

    let eventName = "Huisfeest";
    let startsAt =  Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 5);
    let ticketPriceInEth = 0.2;
    let thresholdInEth = 1.2; //deliberately devidable by 0.2

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
});
