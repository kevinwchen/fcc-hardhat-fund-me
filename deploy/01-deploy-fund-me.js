const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
  // similar to hre.getNamedAccounts and hre.deployments

  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  let ethUsdPriceFeedAddress

  if (developmentChains.includes(network.name)) {
    // Check if network is a development chain
    const ethUsdAggregator = await get("MockV3Aggregator")
    // "get" gets most recent deployment
    ethUsdPriceFeedAddress = ethUsdAggregator.address
  } else {
    // else get the ChainLink pricefeed address for the live chain
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
  }

  // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]

  // when using localhost or hardhat network, use a mock
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUsdPriceFeedAddress],
    log: true,
  })
  log("--------------------------------------------------")
}

module.exports.tags = ["all", "fundme"]
