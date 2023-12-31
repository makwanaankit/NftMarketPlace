require('@nomicfoundation/hardhat-toolbox');

/** @type import('hardhat/config').HardhatUserConfig */
const { alchemyAPIkeyGoerli } = require('./secrets.json');
const { deployerWalletPrivateKey } = require('./secrets.json');
const { etherscanAPIkey } = require('./secrets.json');
module.exports = {
  solidity: '0.8.6',
  networks: {
    hardhat: {
      chainId: 1337,
    },
  },
};
