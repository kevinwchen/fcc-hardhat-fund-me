const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")
const {
  HARDHAT_NETWORK_SUPPORTED_HARDFORKS,
} = require("hardhat/internal/constants")
require("dotenv").config()

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

  const args = [ethUsdPriceFeedAddress]

  // when using localhost or hardhat network, use a mock
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1, // blocks to wait
  })

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    // Verify only if not a development chain
    await verify(fundMe.address, args)
  }

  log("--------------------------------------------------")
}

module.exports.tags = ["all", "fundme"]
