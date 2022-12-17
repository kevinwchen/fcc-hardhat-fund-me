// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// libraries can't have any state variables or send ether
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol"; // import ABI from github

library PriceConverter {
  function getPrice(
    AggregatorV3Interface priceFeed
  ) internal view returns (uint256) {
    (, int256 price, , , ) = priceFeed.latestRoundData();
    return uint256(price * 1e10);
    // uint256 addDecimals = 18 - priceFeed.decimals();
    // return price * (10 ** addDecimals);
  }

  function getConversionRate(
    uint256 ethAmount,
    AggregatorV3Interface priceFeed
  ) internal view returns (uint256) {
    uint ethPrice = getPrice(priceFeed);
    uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
    return ethAmountInUsd;
  }
}
