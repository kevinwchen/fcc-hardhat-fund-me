// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// libraries can't have any state variables or send ether
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol"; // import ABI from github

library PriceConverter {
  function getPrice() internal view returns (uint256) {
    // ABI
    // Address 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
    AggregatorV3Interface priceFeed = AggregatorV3Interface(
      0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
    );
    (, int256 price, , , ) = priceFeed.latestRoundData();
    return uint256(price * 1e10);
    // uint256 addDecimals = 18 - priceFeed.decimals();
    // return price * (10 ** addDecimals);
  }

  function getConversionRate(
    uint256 ethAmount
  ) internal view returns (uint256) {
    uint ethPrice = getPrice();
    uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
    return ethAmountInUsd;
  }
}
