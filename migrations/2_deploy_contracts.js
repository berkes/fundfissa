const Fissa = artifacts.require("Fissa");

module.exports = function(deployer) {
  deployer.deploy(Fissa, "eventName");
};
