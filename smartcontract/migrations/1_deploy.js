var MyContract = artifacts.require("Twitter");

module.exports = function (deployer) {
  deployer.deploy(MyContract);
};