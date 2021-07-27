const NFT = artifacts.require("NFT");
const Marketplace = artifacts.require("Marketplace");
module.exports = function(deployer) {
  deployer.deploy(NFT,"Hello","World");
  //deployer.deploy(Marketplace);
};
