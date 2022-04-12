require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-ethers")
require("@nomiclabs/hardhat-etherscan")
require('hardhat-abi-exporter')
require("hardhat-deploy")
 

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
})



// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
require('dotenv').config()
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL
const MNEMONIC = process.env.MNEMONIC
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
/**
 * @type import('hardhat/config').HardhatUserConfig
 */


module.exports = {
  defaultNetwork: "hardhat",
  networks:{
    hardhat: {  },
    rinkeby: {
      url: RINKEBY_RPC_URL, 
      accounts:{
        mnemonic:MNEMONIC
      },
      saveDeployments: true
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: ETHERSCAN_API_KEY
  },
  solidity: {
    compilers:[
      {version:"0.8.0",},
      {version:"0.8.4",}, 
      {version:"0.6.6",},
      {version:"0.4.24",},
      {version:"0.7.0",},
    ]
  },
  namedAccounts: {
    deployer:{
      default: 0
    }
  }
};
