const Fissa = artifacts.require("Fissa");

module.exports = function(deployer) {
  deployer.deploy(
    Fissa, 
    "event name",
    (Math.floor(Date.now() / 1000) + 3600),
    web3.utils.toWei("0.1"),
    web3.utils.toWei("1.0")
  );
};
