// import
// main function
// calling of main function

// function deployFunc() {
//   console.log("hi there")
// }

// module.exports.default = deployFunc()

const { networkConfig } = require("..helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
  // similar to hre.getNamedAccounts and hre.deployments

  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]

  // when using localhost or hardhat network, use a mock
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [
      /* address */
    ], // put pricefeed address
    log: true,
  })
}
