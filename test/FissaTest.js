const Fissa = artifacts.require("./Fissa.sol");

contract("Fissa", accounts => {
  it("should store the name of the event during deploy", async () => {
    const fissa = await Fissa.new("Huisfeest");
    // Get myString from public variable getter
    const eventName = await fissa.eventName.call();

    assert.equal(eventName, "Huisfeest");
  });

  it("allows setting the name afterwards", async () => {
    const fissa = await Fissa.new("Huisfeest");
    await fissa.set("Het Grote HuisFeest");

    // Get myString from public variable getter
    const eventName = await fissa.eventName.call();

    assert.equal(eventName, "Het Grote HuisFeest");
  });
});
