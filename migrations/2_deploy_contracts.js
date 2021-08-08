const NFT = artifacts.require("NFT");
const Marketplace = artifacts.require("Marketplace");
module.exports = function(deployer) {
  deployer.deploy(NFT,"Hello","World");
  // deployer.deploy(Marketplace);
};


// 2_deploy_contracts.js
// =====================

//    Deploying 'NFT'
//    ---------------
//    > transaction hash:    0xb46acd00cfc9e87144462576ce3ba26708e8ee3f354880b3799416265c799b08
//    > Blocks: 0            Seconds: 0
//    > contract address:    0x221b8e62343565354C4458f4136C69b812Fc6D4B
//    > block number:        3
//    > block timestamp:     1627710032
//    > account:             0x2802b38441E6263F143122785e0162365874ab99
//    > balance:             99.95709778
//    > gas used:            1877511 (0x1ca607)
//    > gas price:           20 gwei
//    > value sent:          0 ETH
//    > total cost:          0.03755022 ETH


//    Deploying 'Marketplace'
//    -----------------------
//    > transaction hash:    0x97ec115911e6721ebb47caaa97631841c2e248a4e305ff482881d356d213bd25
//    > Blocks: 0            Seconds: 0
//    > contract address:    0xE962E89e624F9d00243f2179B933471c44Cbed52
//    > block number:        4
//    > block timestamp:     1627710036
//    > account:             0x2802b38441E6263F143122785e0162365874ab99
//    > balance:             99.93851576
//    > gas used:            929101 (0xe2d4d)
//    > gas price:           20 gwei
//    > value sent:          0 ETH
//    > total cost:          0.01858202 ETH


//    > Saving migration to chain.
//    > Saving artifacts
//    -------------------------------------
//    > Total cost:          0.05613224 ETH


// Summary
// =======
// > Total deployments:   3
// > Final cost:          0.06063698 ETH
